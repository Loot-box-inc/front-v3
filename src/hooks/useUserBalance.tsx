import { InitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

interface useUserBalanceProps {
  initData?: InitData;
}

export const useUserBalance = ({ initData }: useUserBalanceProps) => {
  const [lootboxesCount, setLootboxesCount] = useState(1);
  const [USDT, setUSDT] = useState(2);
  const [LOOT, setLOOT] = useState(3);

  useEffect(() => {
    const run = async () => {

      const lootbox = (await axios.post(`${BACKEND_URL}startParam-lootbox`, { initData })).data;
      const usersLootboxes = (await axios.post(`${BACKEND_URL}usersLootboxes`, { initData })).data;
      console.log("lootbox,usersLootboxes =>", lootbox, usersLootboxes);


      const { data } = lootbox;
      if (data) {
        /*
              // @ts-expect-error - to lazy to fix now
        */
        const { sender_id, parent } = data[0];

        // await supabase
        //   .from("lootboxes")
        //   .update({ receiver_id: sender_id }) // sender of current lootbox 
        //   .eq("id", parent as string); // условие - parent lootbox

        await axios.put(`${BACKEND_URL}userBalance-currentSender`, { sender_id, parent })
      };

      if (!usersLootboxes?.data?.length) {
        setLootboxesCount(0);
        setUSDT(0);
        setLOOT(0);
        return;
      }

      setLootboxesCount(usersLootboxes?.data.length);

      setUSDT(
        usersLootboxes?.data
          .map((i: any) => i.balance || 0) // Treat null balance as 0
          .filter((i: any) => i < 11)
          .reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0) // Provide a default value for reduce
      );

      setLOOT(
        usersLootboxes?.data
          .map((i: any) => i.balance || 0) // Treat null balance as 0
          .filter((i: any) => i > 40)
          .reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0) // Provide a default value for reduce
      );
    };

    run();
  });

  return { lootboxesCount, USDT, LOOT };
};
