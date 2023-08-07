import { Modal, ModalContent } from "@itwin/itwinui-react";
import { FunctionComponent, useEffect } from "react";
import { TestDetails, useClashDetectionTestContext } from "../../context/ClashDetectionTestContext";
import NameDescription from "./NameDescription";
import SetDataSelection from "./SetDataSelection";
import ModalFooter from "./CDTestModalFooter";
import ClashReviewApi from "../../configs/ClashReviewApi";
import { useClashContext } from "../../context/ClashContext";
import AdvancedOption from "./AdvancedOptions";

interface ClashDetectionTestModalProps {
	method: "create" | "update";
	handleModalClose: () => void;
	selectedTestId: string;
}

export const convertStringtoObject = (queryReference: string): { [id: string]: Array<string> } => {
	if (queryReference) {
		let responseObject: { [id: string]: Array<string> } = {};
		const mappingAndGrouppings = queryReference.split(";");
		mappingAndGrouppings.forEach((mappingAndGroupping) => {
			const mappingId = mappingAndGroupping.split(":")[0];
			const groupingIds = mappingAndGroupping.split(":")[1];
			const groupingIdsString = groupingIds.substring(1, groupingIds.length - 1);
			let groupingIdArray = groupingIdsString.split(",");

			responseObject[mappingId] = groupingIdArray;
		});

		return responseObject;
	} else {
		return {};
	}
};

const ClashDetectionTestModal: FunctionComponent<ClashDetectionTestModalProps> = ({ method, handleModalClose, selectedTestId }) => {
	const { currentPage, testDetails, setTestDetails } = useClashDetectionTestContext();
	const { iTwinId } = useClashContext();

	const createClashDetectionTest = () => {
		alert("create clash test");
	};

	const updateClashDetectionTest = () => {
		alert("update clash test");
	};

	const actionHandler = () => {
		if (method === "create") {
			createClashDetectionTest();
		} else {
			updateClashDetectionTest();
		}
	};

	const getModalContent = () => {
		switch(currentPage) {
			case "nameDescription":
				return <NameDescription />
			case "advancedOptions":
				return <AdvancedOption />
			case "setSelection" :
				return <SetDataSelection />
		}
	}

	useEffect(() => {
		const initApp = async () => {
			const response = await ClashReviewApi.getClashTestDetailById(iTwinId, selectedTestId);
			setTestDetails(response);
		};

		if (method === "update") {
			initApp();
		}
	}, []);

	return (
		<Modal
			title={method === "create" ? "Create Clash Detection Test" : `Modify : ${testDetails.name}`}
			style={{ width: "800px" }}
			isOpen={true}
			onClose={handleModalClose}
			closeOnEsc
			closeOnExternalClick
			isDismissible>
			<ModalContent className="customModal">
				{getModalContent()}
			</ModalContent>
			<ModalFooter method={method} actionHandler={actionHandler} />
		</Modal>
	);
};

export default ClashDetectionTestModal;
