import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { FiltersType } from '../../../../types/types';
interface PaginationProps {
  current?: number,
  total?: number,
  pageSize?: number,
  filters: FiltersType,
  setFilters:  React.Dispatch<React.SetStateAction<FiltersType>>
}

const Pagination: React.FC<PaginationProps> = ({
  current = 1,
  total = 10,
  pageSize = 10,
  filters,
  setFilters
}) => {
  
  let totalPages = Math.ceil(total / pageSize);
  
  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    setFilters({...filters, skip: (page - 1) * 10});
  };

  const getButtonStyle = (isActive: boolean = false, isDisabled: boolean = false) => ({
    width: 32,
    height: 32,
    minWidth: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    borderRadius: 8,
    border: `1px solid ${isActive ? '#1890FF' : '#D9D9D9'}`,
    background: '#FFFFFF',
    color: isActive ? '#1890FF' : (isDisabled ? '#D9D9D9' : '#000000'),
    fontSize: 14,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    fontWeight: isActive ? 500 : 400,
  });

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          style={getButtonStyle(i === current, false)}
          onClick={() => handleChange(i)}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  if (totalPages <= 1) totalPages = 1;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Button
        style={getButtonStyle(false, current === 1)}
        onClick={() => handleChange(current - 1)}
        icon={<LeftOutlined style={{ fontSize: 12, paddingBottom: "2px" }} />}
        disabled={current === 1}
      />
      
      {renderPageNumbers()}
      
      <Button
        style={getButtonStyle(false, current === totalPages)}
        onClick={() => handleChange(current + 1)}
        icon={<RightOutlined style={{ fontSize: 12, paddingBottom: "2px" }} />}
        disabled={current === totalPages}
      />
    </div>
  );
};

export default Pagination;