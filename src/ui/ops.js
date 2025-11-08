import { getState } from '../state/app-state.js';

export const initializeOpsModule = () => {
  const downloadButton = document.getElementById('downloadOpsLog');
  if (!downloadButton) return;

  downloadButton.addEventListener('click', () => {
    const log = getState().auditLog || [];
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conecta-audit-log-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
};
