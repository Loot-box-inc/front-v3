import { useState, useEffect } from "react";
import { ActionButton } from "@/pages/TasksPage/components/ActionButton";
import { ActionItem } from "@/pages/TasksPage/components/ActionItem";
import { initInitData, initUtils } from "@telegram-apps/sdk";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL


export const TasksList = () => {

  const [myIp, setMyIp] = useState('');

  const run = async () => {
    const IP_address = (await axios.get('https://api.ipify.org/?format=json')).data;
    setMyIp(IP_address.ip);
    console.log("My_IP = >", IP_address.ip);
  }
  useEffect(() => {
    run();
  }, []);

  const initData = initInitData();
  const utils = initUtils();
  const navigate = useNavigate();

  const _onShare = async () => {
    const uuid = `${uuidv4()}`;
    const senddata = {
      sender_id: initData?.user?.id,
      parent: initData?.startParam,
      sender_updated_at: initData?.authDate,
      IP_address: myIp,
      uuid: uuid
    }

    axios.post(`${BACKEND_URL}createNewLootbox`, { senddata });

    utils.shareURL(
      `${import.meta.env.VITE_APP_BOT_URL}?startapp=${uuid}`,
      "Look! Some cool app here!"
    );
    navigate("/history");
  };

  return (
    <>
      <h1 className="-mt-20 pb-5 text-center text-white font-bold text-lg">
        Choose from one of the tasks below:
      </h1>
      <div>
        <ActionItem
          text="1. Share a lootbox with a friends"
          actionButton={<ActionButton onShare={_onShare}>Send</ActionButton>}
        />
        <ActionItem
          text="2. Upload a video with you and your friends"
          actionButton={
            <ActionButton disabled onShare={() => { }}>
              Upload
            </ActionButton>
          }
        />
        <ActionItem
          text="3. Join our group"
          actionButton={
            <ActionButton disabled onShare={() => { }}>
              Join
            </ActionButton>
          }
        />
      </div>
    </>
  );
};
