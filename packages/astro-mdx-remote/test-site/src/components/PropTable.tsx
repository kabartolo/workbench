// src/components/user-components/PropTable.tsx
interface PropTableProps {
  title: string;
  rows: Array<{ name: string; type: string; required: boolean }>;
  meta: { version: string; deprecated?: boolean };
}

export function PropTable({ title, rows, meta }: PropTableProps) {
  return (
    <div className="prop-table">
      <h3>
        {title}{' '}
        <small>
          v{meta.version}
          {meta.deprecated ? ' (deprecated)' : ''}
        </small>
      </h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td>
                <code>{r.name}</code>
              </td>
              <td>
                <code>{r.type}</code>
              </td>
              <td>{r.required ? '✓' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
