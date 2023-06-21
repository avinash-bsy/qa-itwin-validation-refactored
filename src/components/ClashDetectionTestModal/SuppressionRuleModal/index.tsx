import { Button, IconButton, Modal, ModalButtonBar, ModalContent } from "@itwin/itwinui-react";
import { FunctionComponent, useState } from "react";
import AddSuppressionRule from "./AddSuppressionRule";
import { SvgGoToStart, SvgSave } from "@itwin/itwinui-icons-react";

interface SuppressionRuleModalProps {
	handleModalClose: () => void;
}

type PageTypes = "listRules" | "addRules" | "editRules";

const SuppressionRuleModal: FunctionComponent<SuppressionRuleModalProps> = ({ handleModalClose }) => {
	const [currentPage, setCurrentPage] = useState<PageTypes>();
	return (
		<Modal
			style={{ width: "800px" }}
			title="Suppression Rules"
			isOpen={true}
			onClose={handleModalClose}
			closeOnEsc
			closeOnExternalClick
			isDismissible>
			<ModalContent>
				{currentPage === "listRules" && <></>}
				{currentPage === "addRules" && <AddSuppressionRule />}
			</ModalContent>
			<ModalButtonBar style={{ justifyContent: "space-between" }}>
				<div>
					<IconButton>
						<SvgGoToStart style={{ width: "25", height: "25" }} />
					</IconButton>
				</div>
				<IconButton>
					<SvgSave style={{ width: "25", height: "25" }} /> Save
				</IconButton>
			</ModalButtonBar>
		</Modal>
	);
};

export default SuppressionRuleModal;
