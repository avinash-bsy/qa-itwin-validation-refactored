import { FunctionComponent, useCallback, useState } from "react";
import { useClashDetectionTestContext } from "../../../context/ClashDetectionTestContext";
import { Tab, Tabs } from "@itwin/itwinui-react";
import ModelsTab from "./ModelsTab";
import CategoriesTab from "./CategoriesTab";
import MappingAndGroupingTab from "./MappingAndGroupingTab";

interface InnerTabsProps {
	setData: Record<string, any>;
	selectedDataItems: any;
}

const InnerTabs: FunctionComponent<InnerTabsProps> = ({ setData, selectedDataItems }) => {
	const [activeTab, setActiveTab] = useState<number>(0);

	const setTabSelectedItems = (tab: "models" | "categories" | "mappingAndGroupings", ids: any): void => {
		// selectedItems[tab] = ids;
		// selectedDataItems[tab] = ids;
		// updateSelectedData(selectedDataItems);
	};

	const getContent = useCallback(() => {
		switch (activeTab) {
			case 0:
				return (
					<ModelsTab
						selectedModels={selectedDataItems.models}
						modelsList={setData.models}
						setSelectedItems={setTabSelectedItems}
					/>
				);
			case 1:
				return (
					<CategoriesTab
						selectedCategories={selectedDataItems.categories}
						categoriesList={setData.categories}
						setSelectedItems={setTabSelectedItems}
					/>
				);
			case 2:
				return (
					<MappingAndGroupingTab
						selectedMapAndGroups={selectedDataItems.mappingAndGroupings}
						mapAndGroupsList={setData.mappingAndGroupings}
						setSelectedItems={setTabSelectedItems}
					/>
				);
		}
	}, [activeTab]);

	return (
		<Tabs
			type="borderless"
			labels={[<Tab key={1} label="Models" />, <Tab key={2} label="Categories" />, <Tab key={3} label="Mapping And Grouping" />]}
			onTabSelected={(index: number) => {
				setActiveTab(index);
			}}>
			<div>{getContent()}</div>
		</Tabs>
	);
};

export default InnerTabs;
