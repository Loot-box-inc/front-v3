import { Database } from "@/types/supabase";
import { InitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL
interface useUserTransactionsProps {
  initData?: InitData;
}

type userTransactionsType =
  | Database["public"]["Tables"]["lootboxes"]["Row"][]
  | null;

export const useUserTransactions = ({ initData }: useUserTransactionsProps) => {
  const [userTransactions, setUserTransactions] = useState<userTransactionsType>();

  useEffect(() => {
    const getData = async () => {
      const allData = (await axios.get(`${BACKEND_URL}all`, { headers: { 'ngrok-skip-browser-warning': '7777' } })).data;
      setUserTransactions(allData.data);
    };

    console.log("useId", initData?.user?.id);
    getData();
  }, []);
  
  return { userTransactions };
};
