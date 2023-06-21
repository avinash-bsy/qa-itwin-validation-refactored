import { IconButton, ModalButtonBar, ModalContent, ProgressLinear, Tab, Tabs } from "@itwin/itwinui-react";
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { SetData, useClashDetectionTestContext } from "../../../context/ClashDetectionTestContext";
import InnerTabs from "./InnerTabs";
import { SvgGoToStart, SvgSave } from "@itwin/itwinui-icons-react";
import { useClashContext } from "../../../context/ClashContext";
import ClashReviewApi from "../../../configs/ClashReviewApi";

interface SetDataSelectionProps {}

const SetDataSelection: FunctionComponent<SetDataSelectionProps> = () => {
	const [activeTab, setActiveTab] = useState<"setA" | "setB">("setA");
	const [loading, setLoading] = useState<boolean>(true);
	const [selectableDataItems, setSelectableDataItems] = useState<Record<string, any>>({});

	const { stateData } = useClashDetectionTestContext();
	const { iModelId, iTwinId } = useClashContext();

	const getFilteredDataItemsForActiveTab = () => {
		try {
			let setDataToExclude: SetData = activeTab === "setA" ? stateData.setB : stateData.setA;
			let filteredDataItems = {
				models: [],
				categories: [],
				mappingAndGroupings: {},
			};

			// this is done to not modify main dataItems object
			const tempObject: SetData = JSON.parse(JSON.stringify(selectableDataItems));

			Object.entries(tempObject).map(([tab, values]) => {
				if (tab === "mappingAndGroupings") {
					filteredDataItems[tab] = values.filter((value: any) => {
						if (setDataToExclude[tab][value.id]) {
							value.subRows = value.subRows.filter((subRow: any) => !setDataToExclude[tab][value.id].includes(subRow.id));

							return value.subRows.length > 0;
						}
						return true;
					});
				} else if (tab === "models" || tab === "categories") {
					filteredDataItems[tab] = values.filter((value: any) => !setDataToExclude[tab]?.includes(value.id));
				}
			});

			return filteredDataItems;
		} catch (error) {
			console.log(error);
			let filteredDataItems = {
				models: [],
				categories: [],
				mappingAndGroupings: {},
			};
			return filteredDataItems;
		}
	};

	const getSelectedDataItemsForActiveTab = () => {
		return { ...stateData[activeTab] };
	};

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

	return (
		<Tabs
			labels={[<Tab key={1} label="Set A" />, <Tab key={2} label="Set B" />]}
			onTabSelected={(index) => {
				setActiveTab(index === 0 ? "setA" : "setB");
			}}
			activeIndex={activeTab === "setA" ? 0 : 1}>
			{loading ? (
				<ProgressLinear indeterminate={true} />
			) : (
				<InnerTabs setData={getFilteredDataItemsForActiveTab()} selectedDataItems={getSelectedDataItemsForActiveTab()} />
			)}
		</Tabs>
	);
};

export default SetDataSelection;
