import * as React from 'react';
import { ModalProps, useModal } from '../layout/Modal';
import { Button } from './Button';

const ConfirmModal: React.FC<ModalProps<{ text: string; onConfirm: () => void }>> = function ConfirmModal({ hideModal, props }) {
  function confirm() {
    hideModal();
    props.onConfirm();
  }
  return (
    <div className="space-y-8 p-4">
      <div>{props.text}</div>
      <div className="flex justify-between">
        <Button className="btn-primary" onClick={confirm} text="CONFIRM" />
        <Button className="btn-secondary" onClick={hideModal} text="CANCEL" />
      </div>
    </div>
  );
};

export function useConfirmModal(text: string, onConfirm: () => void) {
  return useModal(null, ConfirmModal, { text, onConfirm });
}
