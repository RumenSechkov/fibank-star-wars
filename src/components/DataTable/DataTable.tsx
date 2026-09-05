import type { Person } from '../../types/api';
import styles from './DataTable.module.css';

/** Table columns, in display order, mapped to their `Person` field. */
const COLUMNS: ReadonlyArray<{ key: keyof Person; label: string }> = [
  { key: 'name', label: 'Name' },
  { key: 'mass', label: 'Mass' },
  { key: 'height', label: 'Height' },
  { key: 'hair_color', label: 'Hair color' },
  { key: 'skin_color', label: 'Skin color' },
];

interface DataTableProps {
  people: Person[];
  /** 1-based index of the page currently displayed. */
  page: number;
  /** Total number of characters across all pages. */
  count: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export default function DataTable({
  people,
  page,
  count,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
}: DataTableProps) {
  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        <table className={styles.table}>
          <caption className={styles.caption}>
            {count} characters in total
          </caption>
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.key} scope='col'>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.url}>
                {COLUMNS.map((column) => (
                  <td key={column.key} data-label={column.label}>
                    <span className={styles.value}>{person[column.key] || '—'}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className={styles.pagination} aria-label='Pagination'>
        <button
          type='button'
          className={styles.pageButton}
          onClick={onPreviousPage}
          disabled={!hasPreviousPage}
        >
          Previous
        </button>
        <span className={styles.pageIndicator}>Page {page}</span>
        <button
          type='button'
          className={styles.pageButton}
          onClick={onNextPage}
          disabled={!hasNextPage}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
