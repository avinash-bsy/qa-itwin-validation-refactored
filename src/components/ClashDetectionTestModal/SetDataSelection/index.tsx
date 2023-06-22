import { IconButton, ModalButtonBar, ModalContent, ProgressLinear, Tab, Tabs } from "@itwin/itwinui-react";
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { useClashDetectionTestContext } from "../../../context/ClashDetectionTestContext";
import InnerTabs from "./InnerTabs";
import { SvgGoToStart, SvgSave } from "@itwin/itwinui-icons-react";
import { useClashContext } from "../../../context/ClashContext";
import ClashReviewApi from "../../../configs/ClashReviewApi";

interface SetDataSelectionProps {}

const SetDataSelection: FunctionComponent<SetDataSelectionProps> = () => {
	const [activeTab, setActiveTab] = useState<"setA" | "setB">("setA");
	const [loading, setLoading] = useState<boolean>(true);
	const [selectableDataItems, setSelectableDataItems] = useState<Record<string, any>>({});
	const { iModelId, iTwinId } = useClashContext();

	useEffect(() => {
		const initApp = async () => {
			try {
				const modelAndCategories = await ClashReviewApi.getModelsAndCategories(iModelId, iTwinId);
				const { models, categories } = modelAndCategories;
				const mappingAndGroupings = await ClashReviewApi.getMappingAndGrouping(iModelId);

				setSelectableDataItems({ models, categories, mappingAndGroupings });
			} catch (error) {
				console.log(error);
				setLoading(false);
			} finally {
				setLoading(false);
			}
		};

		initApp();
	}, []);

	const setData = {
		models: [],
		categories: [],
		mappingAndGroupings: {},
	};

	return (
		<Tabs
			labels={[<Tab key={1} label="Set A" />, <Tab key={2} label="Set B" />]}
			onTabSelected={(index: number) => {
				setActiveTab(index === 0 ? "setA" : "setB");
			}}
			activeIndex={activeTab === "setA" ? 0 : 1}>
			{loading ? <ProgressLinear indeterminate={true} /> : <InnerTabs setData={setData} selectedDataItems={setData} />}
		</Tabs>
	);
};

export default SetDataSelection;
