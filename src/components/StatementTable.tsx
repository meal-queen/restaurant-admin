import { FC, useEffect, useState } from 'react';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Header from '@cloudscape-design/components/header';
import Pagination from '@cloudscape-design/components/pagination';
import axios from 'axios';
import { getCookie } from '../utils/cookies';
import { useNavigate, useParams } from 'react-router-dom';

const StatementTable: FC = () => {
  const [data, setData] = useState<any>();
  const { page } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = getCookie('auth_token');

    if (!authToken) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          import.meta.env.VITE_BACKEND + '/auth/@me',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const restuarant = userResponse.data.restuarant;

        if (!restuarant) {
          navigate('/0');
          return;
        }

        const queryResponse = await axios.get(
          `http://localhost:8080/api/restuarant/log/pay?page=${
            page ?? 0
          }&take=10&restuarant=${restuarant}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        setData(queryResponse.data.data);
      } catch (error) {
        navigate('/');
      }
    };

    fetchUserData();
  }, [page]);

  return (
    <>
      {!data ? (
        <></>
      ) : (
        <Table
          columnDefinitions={[
            {
              id: 'uuid',
              header: 'uuid',
              cell: (item: any) => item.uuid,
            },
            {
              id: 'point',
              header: 'point',
              cell: (item: any) => item.point,
            },
          ]}
          loadingText="Loading resources"
          empty={
            <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No resources</b>
              </SpaceBetween>
            </Box>
          }
          header={
            <Header
              counter={
                data.content.length
                  ? '(' + data.content.length + '/10)'
                  : '(10)'
              }
            >
              가입 회사 리스트
            </Header>
          }
          items={data.content}
          pagination={
            <Pagination
              currentPageIndex={Number(page)}
              pagesCount={data.totalPages - 1}
              onChange={(e) =>
                navigate(
                  `/${
                    e.detail.currentPageIndex < 0 || !e.detail.currentPageIndex
                      ? 0
                      : e.detail.currentPageIndex
                  }`
                )
              }
            />
          }
        />
      )}
    </>
  );
};

export default StatementTable;
