import { ContentLayout, Header } from '@cloudscape-design/components';
import StatementTable from '../components/StatementTable';

export default function Home() {
  return (
    <ContentLayout header={<Header variant="h1">가맹점 ADMIN</Header>}>
      <StatementTable />
    </ContentLayout>
  );
}
