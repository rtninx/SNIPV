import { Text } from "@nextui-org/react";
import React from "react";
import Sidebar from "../components/Settings/Sidebar";

const SettingsLayout = ({ children }) => {
  return (
    <div className="min-h-[70vh]">
      <div className="">
        <div className="flex justify-center items-center h-20">
          <Text h4 transform="uppercase">
            Indstillinger
          </Text>
        </div>
        <div className="flex gap-3">
          <div>
            <Sidebar />
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
