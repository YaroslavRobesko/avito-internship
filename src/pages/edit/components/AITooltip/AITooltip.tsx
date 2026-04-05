import { Popover, Button } from "antd";

interface AITooltipProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: "top" | "bottom" | "left" | "right";
  isError?: boolean;
  title?: string;
  onClose?: () => void;
}

export const AITooltip: React.FC<AITooltipProps> = ({
  visible,
  onVisibleChange,
  content,
  children,
  placement = "top",
  isError = false,
  title = isError ? "Произошла ошибка при запросе к AI" : "Ответ от AI",
  onClose,
}) => {
  const handleClose = () => {
    onVisibleChange(false);
    onClose?.();
  };

  const renderContent = () => {
    if (isError) {
      return (
        <div style={{ padding: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              marginBottom: 8,
              color: "#C00F0C",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 400,
              marginBottom: 12,
              color: "#000000",
            }}
          >
            Попробуйте повторить запрос или закройте уведомление
          </div>
          <Button
            size="small"
            style={{
              backgroundColor: "#FCB3AD",
              color: "#000000",
              border: "none",
              borderRadius: 2,
              fontSize: 12,
              fontWeight: 400,
              padding: "4px 12px",
              height: "auto",
            }}
            onClick={handleClose}
          >
            Закрыть
          </Button>
        </div>
      );
    }

    // Success case
    return (
      <div style={{ padding: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            marginBottom: 8,
            color: "#000000",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "#000000",
          }}
        >
          {content}
        </div>
      </div>
    );
  };

  const popoverStyle = {
    width: 332,
    padding: 8,
    borderRadius: 2,
    ...(isError
      ? { backgroundColor: "#FEE9E7", boxShadow: "none" }
      : { backgroundColor: "#FFFFFF", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }),
  };

  return (
    <Popover
      open={visible}
      onOpenChange={onVisibleChange}
      placement={placement}
      content={renderContent()}
      overlayInnerStyle={popoverStyle}
      trigger={[]}
      overlayClassName="ai-tooltip-popover"
      destroyTooltipOnHide
    >
      {children}
    </Popover>
  );
};