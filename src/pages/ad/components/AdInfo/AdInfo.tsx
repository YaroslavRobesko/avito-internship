import { Flex } from "antd";
import AdCharacteristics from "./components/AdCharacteristics/AdCharacteristics";
import AdNotification from "./components/AdNotification/AdNotification";

interface Characteristic {
  label: string;
  value: string;
}

interface props {
  characteristics: Characteristic[] | undefined;
  fields: string[] | undefined;
}

export default function AdInfo({
  characteristics,
  fields,
}: props): React.ReactNode {
  return (
    <Flex gap={16} vertical>
      {fields && fields.length > 0 && <AdNotification fields={fields} />}
      <AdCharacteristics characteristics={characteristics} />
    </Flex>
  );
}
