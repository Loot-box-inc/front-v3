import { Link } from "@/components/Link/Link";
import { LockedLootbox } from "@/components/LockedLootbox";

// import { useUserBalance } from "@/hooks/useUserBalance";

import { useEffect, useState } from "react";
// import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

import { initInitData, initUtils } from "@telegram-apps/sdk";

export function HomePage() {
  const navigate = useNavigate();
  const initData = initInitData();
  const utils = initUtils();

  const [lootboxesCount, setLootboxesCount] = useState(0);
  const [USDT, setUSDT] = useState(0);
  const [LOOT, setLOOT] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [isSendersLootbox, setIsSendersLootbox] = useState(false);
  const [isLootboxAlreadyOpened, setIsLootboxAlreadyOpened] = useState(false);
  const [isNotFirstLootbox, setIsNotFirstLootbox] = useState(false);

  const _onShare = async () => {
    try {
      // get not used lootboxes only
      const data = (await axios.get(`${BACKEND_URL}notUsedLootbox`, { headers: { 'ngrok-skip-browser-warning': '7777' } })).data;
      if (!data?.length) {
        console.log("There are not unused lootboxes");
        return;
      }
      const lootbox = data[Math.floor(Math.random() * data.length)];
      // write yourself as a sender = take a loot box
      await axios.put(`${BACKEND_URL}takeLootbox`, { initData, lootbox });

      utils.shareURL(
        `${import.meta.env.VITE_APP_BOT_URL}?startapp=${lootbox.uuid}`,
        "Look! Some cool app here!"
      );
      // onShare(true);
      navigate("/history");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const run = async () => {
      //get data from server

      console.log("initialData => ", initData);
      console.log("`Backend_url` => ", BACKEND_URL);

      const { data } = (await axios.post(`${BACKEND_URL}initialData`, { initData })).data;
      console.log("initialData data =>", data);

      // Handle no lootbox
      // if (!data?.length) {
      //   setIsLoading(false);
      //   return navigate("/tasks", { replace: true });
      // } 

      if (data?.length) {
        const { sender_id, receiver_id, parent, uuid } = data![0];
        console.log("sender_id, receiver_id, parent =>", sender_id, receiver_id, parent, uuid);

        // ничего не делаем, если пытаются вручную UUID в ссылке указать        
        // и отгадывают реальный НЕоткрытый lootbox => go to next /tasks screen   
        if (sender_id == null) return navigate("/tasks", { replace: true });

        // юзер отправил сам себе
        if (sender_id === (initData?.user?.id as number)) {
          setIsSendersLootbox(true);
          return;
        }

        // лутбокс уже открыт
        if (receiver_id != null) {
          setIsLootboxAlreadyOpened(true);
          return;
        }

        // 2ой раз уже от этого sender'a
        // получить все лутбоксы где юзер = receiver_id
        // get usersOpenedLootboxes from server
        const usersOpenedLootboxes = (await axios.post(`${BACKEND_URL}usersOpenedLootboxes`, { initData })).data;

        // взять всех сендеров и проверить нет ли там сендера текущего лутбокса
        setIsNotFirstLootbox(
          usersOpenedLootboxes?.data
            ?.map((i: any) => i.sender_id)
            .includes(sender_id) as boolean
        );

        //update receiver_id current lootbox
        // await axios.put(`${BACKEND_URL}sendCurrentLootbox`, { sender_id, parent });
        await axios.put(`${BACKEND_URL}sendCurrentLootbox`, { sender_id, uuid, initData });

        if (!usersOpenedLootboxes?.data?.length) {
          setIsLoading(false);
          return;
        }

        setLootboxesCount(usersOpenedLootboxes?.data.length);

        setUSDT(
          usersOpenedLootboxes?.data
            .map((i: any) => i.balance || 0) // Treat null balance as 0
            .filter((i: any) => i < 11)
            .reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0) // Provide a default value for reduce
        );

        setLOOT(
          usersOpenedLootboxes?.data
            .map((i: any) => i.balance || 0) // Treat null balance as 0
            .filter((i: any) => i > 40)
            .reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0) // Provide a default value for reduce
        );
        setIsLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    const run = async () => {
      await axios.post(`${BACKEND_URL}user/upsert`, { initData });
    };

    run();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black"
    >
      {isSendersLootbox && (
        <>
          <h2 className="text-center mt-50 p-5 pt-50 text-white toptitle ">
            You cannot send the lootbox to yourself. <br />Try again
          </h2>
          <div className="toptitle"
            onClick={_onShare}
            style={{
              background: 'dodgerblue',
              padding: '10px',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
            }}>Send another task</div>
        </>
      )}

      {isLootboxAlreadyOpened && (
        <>
          <h1 className="text-center mt-50 p-5 pt-50 text-white toptitle " style={{fontSize:'25px'}}>
            Lootbox is empty!
          </h1>
          <div className="toptitle"
            onClick={_onShare}
            style={{
              background: 'dodgerblue',
              padding: '10px',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
            }}>Send another task</div>
        </>
      )}

      {isNotFirstLootbox && (
        <h2 className="text-center mt-50 p-5 pt-50 text-white toptitle">
          {`You can't open more than one lootbox from a user`}
        </h2>
      )}

      {!isLoading && (
        <>
          <img src="./lootbox-closed.gif" alt="loading..." />
          <h2 className="text-center mt-50 p-5 pt-50 text-white">
            {`You've already opened ${lootboxesCount} lootboxes and your balance is ${USDT} USDT and ${LOOT} LOOT.
    To open this box, you need to fulfill a task`}
          </h2>

        </>
      )}
      {isSendersLootbox ? ("") : isLootboxAlreadyOpened ? ("") : (
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
        </>
      )}
    </main>
  );
}
