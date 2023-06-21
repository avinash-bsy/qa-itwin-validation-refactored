import React, { Dispatch, FunctionComponent, SetStateAction, createContext, useContext, useState } from "react";

export interface TestDetails {
	name: string;
	description: string;
	configType: number;
	includeSubModels: boolean;
	advancedSettings: {
		longClash: boolean;
		calculateOverlap: boolean;
		toleranceOverlapValidation: boolean;
	};
	suppressTouching: boolean;
	touchingTolerance: number;
}

type PageType = "nameDescription" | "setSelection" | "advancedOptions";

interface ClashDetectionTestType {
	testDetails: TestDetails;
	currentPage: PageType;
	setCurrentPage: Dispatch<SetStateAction<PageType>>;
	setTestDetails: Dispatch<SetStateAction<TestDetails>>;
}

const ClashDetectionTestContext = createContext<ClashDetectionTestType>({
	testDetails: {
		name: "",
		description: "",
		configType: 2,
		includeSubModels: true,
		advancedSettings: {
			longClash: true,
			calculateOverlap: true,
			toleranceOverlapValidation: false,
		},
		suppressTouching: false,
		touchingTolerance: 0,
	},
	currentPage: "nameDescription",
	setCurrentPage: () => {},
	setTestDetails: () => {},
});

interface PropsType {
	children: FunctionComponent;
}

const ClashDetectionTestProvider: FunctionComponent = ({ children }: PropsType) => {
	const [testDetails, setTestDetails] = useState<TestDetails>({
		name: "",
		description: "",
		configType: 2,
		includeSubModels: true,
		advancedSettings: {
			longClash: true,
			calculateOverlap: true,
			toleranceOverlapValidation: false,
		},
		suppressTouching: false,
		touchingTolerance: 0,
	});
	const [currentPage, setCurrentPage] = useState<PageType>("nameDescription");

	const contextValues: ClashDetectionTestType = {
		testDetails,
		currentPage,
		setCurrentPage,
		setTestDetails,
	};

	return <ClashDetectionTestContext.Provider value={contextValues}>{children}</ClashDetectionTestContext.Provider>;
};

const useClashDetectionTestContext = () => useContext(ClashDetectionTestContext);

export { ClashDetectionTestContext, ClashDetectionTestProvider, useClashDetectionTestContext };
