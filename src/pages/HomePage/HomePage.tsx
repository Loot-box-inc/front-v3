import { Link } from "@/components/Link/Link";
import { LockedLootbox } from "@/components/LockedLootbox";
import { useEffect, useState } from "react";
import { initInitData } from "@telegram-apps/sdk";
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

export function HomePage() {
  const initData = initInitData();
  const [isState, setIsstate] = useState<any>();

  useEffect(() => {

    const run = async () => {
      const myIp = (await axios.get('https://api.ipify.org/?format=json'))!.data!.ip;
      // console.log("initialData => ", initData);
      // console.log("`Backend_url` => ", BACKEND_URL);

      if (initData!.startParam === "debug" || initData!.startParam === undefined) {
        console.log('First');
        return;
      }

      console.log("initialData => ", initData);
      // console.log("SendUuid =>", SendUuid);
      console.log("myIp => ", myIp);

      axios.post(`${BACKEND_URL}initialData`, { initData, myIp })
        .then((res) => {
          console.log("res =>", res);
          if (res.data?.state === "yourself") {
            setIsstate('yourself');
            return;
          }
          if (res.data?.state === "empty") {
            setIsstate('empty');
            return;
          }
        })
        .catch((err) => {
          console.log("err =>", err);
        });


      //get data from server
      // const { data } = (await axios.post(`${BACKEND_URL}initialData`, { initData })).data;
      // console.log("initialData data =>", data);

      // if (data?.length > 0) {

      //   const { sender_id, parent, uuid } = data![0];
      //   console.log("sender_id, receiver_id, parent =>", sender_id, parent, uuid);

      //   axios.put(`${BACKEND_URL}sendCurrentLootbox`, { sender_id, uuid, initData });

      //   const usersOpenedLootboxes = (await axios.post(`${BACKEND_URL}usersOpenedLootboxes`, { initData })).data;

      //   setLootboxesCount(usersOpenedLootboxes?.data.length);


      //   setUSDT(
      //     usersOpenedLootboxes?.data
      //       .map((i: any) => i.balance || 0) // Treat null balance as 0
      //       .filter((i: any) => i < 11)
      //       .reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0) // Provide a default value for reduce
      //   );

      //   setLOOT(
      //     usersOpenedLootboxes?.data
      //       .map((i: any) => i.balance || 0) // Treat null balance as 0
      //       .filter((i: any) => i > 40)
      //       .reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0) // Provide a default value for reduce
      //   );

      // setIsLoading(false);
      // }
    };
    run();
  }, []);

  useEffect(() => {
    const run = async () => {
      axios.post(`${BACKEND_URL}user/upsert`, { initData });
    };
    run();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black"
    >
      {isState === 'yourself' ? (
        <>
          <h2 className="text-center mt-50 p-5 pt-50 text-white toptitle ">
            You cannot send the lootbox to yourself. <br />Try again
          </h2>
          <Link to="/tasks" className="bg-blue rounded p-2 px-10 text-white">
            Send another tasks
          </Link>
        </>
      ) : isState === 'empty' ? (
        <>
          <h2 className="text-center mt-50 p-5 pt-50 text-white toptitle ">
            Lootbox is EMPTY <br />Try again
          </h2>
          <Link to="/tasks" className="bg-blue rounded p-2 px-10 text-white">
            Send another tasks
          </Link>
        </>
      ) :(
        <>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '30%'

          }}>
            <LockedLootbox width={220} height={220} />
          </div>

          <div style={{
            position: 'absolute',
            bottom: '10%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{ color: 'white', textAlign: 'center' }}>
              <h2 className="toptitle">To open this box</h2>
              <h2 className="toptitle">you need to fulfill a task</h2>
            </div>
            <Link to="/tasks" className="bg-blue rounded p-2 px-10 text-white">
              Go!
            </Link>
          </div>
        </>)}
    </main>
  );
}
