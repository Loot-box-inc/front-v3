import { ActionButton } from "@/pages/TasksPage/components/ActionButton";
import { ActionItem } from "@/pages/TasksPage/components/ActionItem";
import { initInitData, initUtils } from "@telegram-apps/sdk";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

export const TasksList = () => {
  const initData = initInitData();
  const utils = initUtils();
  const navigate = useNavigate();

  const _onShare = async () => {
      const uuid = (await axios.post(`${BACKEND_URL}createNewLootbox`, { headers: { 'ngrok-skip-browser-warning': '7777' }, initData })).data;
      
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
