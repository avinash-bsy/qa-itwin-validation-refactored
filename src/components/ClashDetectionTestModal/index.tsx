import { Button, Modal, ModalButtonBar, ModalContent } from "@itwin/itwinui-react";
import { FunctionComponent, useEffect } from "react";
import { TestDetails, useClashDetectionTestContext } from "../../context/ClashDetectionTestContext";
import NameDescription from "./NameDescription";
import SetDataSelection from "./SetDataSelection";
import ModalFooter from "./CDTestModalFooter";
import ClashReviewApi from "../../configs/ClashReviewApi";
import { useClashContext } from "../../context/ClashContext";

interface ClashDetectionTestModalProps {
	method: "create" | "update";
	handleModalClose: () => void;
	selectedTestId: string;
}

const ClashDetectionTestModal: FunctionComponent<ClashDetectionTestModalProps> = ({ method, handleModalClose, selectedTestId }) => {
	const { currentPage, testDetails, setTestDetails, setStateData } = useClashDetectionTestContext();
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

	useEffect(() => {
		const initApp = async () => {
			const response = await ClashReviewApi.getClashTestDetailById(iTwinId, selectedTestId);
			setTestDetails(response);
			setStateData({
				setA: {
					models: response.setA?.modelIds || [],
					categories: response.setA?.categoryIds || [],
					mappingAndGroupings: convertStringtoObject(response.setA?.queries?.queryReference),
				},
				setB: {
					models: response.setB?.modelIds || [],
					categories: response.setB?.categoryIds || [],
					mappingAndGroupings: convertStringtoObject(response.setB?.queries?.queryReference),
				},
			});
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
				{currentPage === "nameDescription" && <NameDescription />}
				{currentPage === "setSelection" && <SetDataSelection />}
			</ModalContent>
			<ModalFooter method={method} actionHandler={actionHandler} />
		</Modal>
	);
};

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

export default ClashDetectionTestModal;