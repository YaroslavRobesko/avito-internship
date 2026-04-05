import { Button, message, Space, Typography } from "antd";
import { useState } from "react";
import {
  BulbOutlined,
  RedoOutlined,
  Loading3QuartersOutlined,
} from "@ant-design/icons";
import { generateImprovedDescription } from "../../lib/llmUtils";
import { AITooltip } from "../AITooltip/AITooltip";
import type { ItemUpdateIn } from "../../../../types/types";

interface AIDescriptionButtonProps {
  formData: ItemUpdateIn;
  setFormData: (data: ItemUpdateIn) => void;
}

const AIDescriptionButton: React.FC<AIDescriptionButtonProps> = ({
  formData,
  setFormData,
}) => {
  const [loading, setLoading] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [suggestion, setSuggestion] = useState<{
    description: string;
    suggestion: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasRequested, setHasRequested] = useState(false);
  const { Text } = Typography;

  const handleClick = async () => {
    setLoading(true);
    setTooltipVisible(false);
    setError(null);
    setSuggestion(null);

    try {
      const result = await generateImprovedDescription(formData);
      if (result.suggestion === "Не удалось связаться с AI-ассистентом"){
        throw new Error("Произошла ошибка при запросе к AI");
      }
      setSuggestion({
        description: result.improvedDescription,
        suggestion: result.suggestion,
      });
      setTooltipVisible(true);
      setHasRequested(true);
    } catch {
      setError("Произошла ошибка при запросе к AI");
      setTooltipVisible(true);
      setHasRequested(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestion) {
      setFormData({ ...formData, description: suggestion.description });
      message.success("Описание обновлено");
      setTooltipVisible(false);
      setHasRequested(false);
      setSuggestion(null);
    }
  };

  const handleClose = () => {
    setTooltipVisible(false);
    setError(null);
    setSuggestion(null);
    setHasRequested(false);
  };

  const renderTooltipContent = () => {
    if (error) {
      return (
        <div>
          <div
            style={{
              fontWeight: 500,
              fontSize: 12,
              color: "#C00F0C",
              marginBottom: 8,
              
            }}
          >
            Произошла ошибка при запросе к AI
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 12,
              color: "#000000",
              marginBottom: 12,
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
            }}
            onClick={handleClose}
          >
            Закрыть
          </Button>
        </div>
      );
    }

    if (suggestion) {
      return (
        <div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 12,
              marginBottom: 8,
              color: "#000000",
            }}
          >
            {suggestion.suggestion}
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: 12,
              marginBottom: 12,
              color: "#000000",
            }}
          >
            <Text type="secondary">Значение:</Text> {suggestion.description}
          </div>
          <Space size={8}>
            <Button
              size="small"
              type="primary"
              style={{ backgroundColor: "#1890FF", borderRadius: 2 }}
              onClick={handleApply}
            >
              Применить
            </Button>
            <Button
              size="small"
              style={{
                borderColor: "#D9D9D9",
                color: "#000000",
                borderRadius: 2,
              }}
              onClick={handleClose}
            >
              Закрыть
            </Button>
          </Space>
        </div>
      );
    }

    return null;
  };

  const getButtonText = () => {
    if (loading) return "Выполняется запрос";
    if (hasRequested) return "Повторить запрос";
    return "Улучшить описание";
  };

  const buttonIcon = () => {
    if (loading)
      return (
        <Loading3QuartersOutlined spin style={{ width: 14, height: 14 }} />
      );
    if (hasRequested) return <RedoOutlined style={{ fontSize: 14 }} />;
    return <BulbOutlined style={{ fontSize: 14 }} />;
  };

  return (
    <AITooltip
      visible={tooltipVisible}
      onVisibleChange={setTooltipVisible}
      content={renderTooltipContent()}
      isError={!!error}
    >
      <Button
        onClick={handleClick}
        style={{
          backgroundColor: "#F9F1E6",
          color: "#FFA940",
          fontSize: 14,
          fontWeight: 400,
          padding: "7px 12px",
          height: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 2,
        }}
        icon={buttonIcon()}
      >
        {getButtonText()}
      </Button>
    </AITooltip>
  );
};

export default AIDescriptionButton;
