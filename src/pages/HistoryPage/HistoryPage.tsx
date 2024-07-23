import { Link } from "@/components/Link/Link";
import USDT from "@/assets/usdt.svg?react";
import LOOT from "@/assets/loot.svg?react";
import { initInitData } from "@telegram-apps/sdk";
import { useUserBalance } from "@/hooks/useUserBalance";
import { useUserTransactions } from "@/hooks/useUserTransactions";
import { format } from "date-fns";

export const HistoryPage = () => {
  const initData = initInitData();
  const { USDT: usdtBalance, LOOT: lootBalance } = useUserBalance({ initData });
  const { userTransactions } = useUserTransactions({ initData });

  console.log("{ USDT: usdtBalance, LOOT: lootBalance } =>",
    { USDT: usdtBalance, LOOT: lootBalance }
  );
  console.log("userTransactions=>", userTransactions);


  return (
    <main className="flex min-h-screen flex-col items-center bg-[#1D2733] text-white">
      {/* Header */}
      <div className="flex w-full px-2 mt-5 items-center justify-between gap-2">
        <div className="flex gap-4">
          <div className="flex gap-2 items-center">
            <USDT />
            <p className="text-sm">USDT {usdtBalance}</p>
          </div>
          <div className="flex gap-2 items-center">
            <LOOT />
            <p className="text-sm">LOOT {lootBalance}</p>
          </div>
        </div>
        {/* <TonConnectButton /> */}
      </div>

      <Link
        to="/tasks"
        className="bg-blue py-2 px-6 text-white rounded-full my-12"
      >
        Send another link
      </Link>

      {/* Transaction history */}
      <div className="w-full px-2">
        <p>Transaction history</p>

        {userTransactions?.map((el) => {
          if (!el.sender_updated_at && !el.Status_opened) {
            return;
          }
          return (
            <div
              key={el.id}
              className="bg-black rounded-md mt-2 px-2 flex items-center gap-2"
            >
              <img src="/front-v3/box.png" height={75} width={75} />
              <p className="w-1/5">
                {el.sender_updated_at
                  ? format(new Date(el.sender_updated_at), "hh:mm dd MMMyyyy")
                  : "-"}
              </p>
              <p className="w-1/4">{el.receiver_id || "-"}</p>

              {el.Status_opened === "received" && (
                <Link
                  to="/claim"
                  className="bg-blue px-2 py-1 text-white rounded-full w-fit flex truncate"
                >
                  See lootbox
                </Link>
              )}

              {el.Status_opened === "opened" && (
                <p>
                  {el.balance_LOOT && el.balance_LOOT > 0
                    ? `${el.balance_LOOT} LOOT`
                    : ""}

                  {el.balance_USDT && el.balance_USDT > 0
                    ? `${el.balance_USDT} USDt`
                    : ""}
                </p>
              )}

              {el.Status_opened === "unopened" && <p>Unopened</p>}
              {/* <p className="w-1/4">{el.Status_opened || "-"}</p> */}
            </div>
          );
        })}
      </div>
    </main>
  );
};
