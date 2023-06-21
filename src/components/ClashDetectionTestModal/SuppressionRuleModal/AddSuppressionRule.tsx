import { FunctionComponent, useState } from "react";
import SelectRuleTemplates from "./SelectRuleTemplates";
import RuleDetails from "./RuleDetails";

interface AddSuppressionRuleProps {}

const AddSuppressionRule: FunctionComponent<AddSuppressionRuleProps> = () => {
	const [currentPage, setCurrentPage] = useState<"listTemplates" | "ruleDetails">("listTemplates");
	const [ruleDetails, setRuleDetails] = useState({});
	return (
		<>
			{currentPage === "listTemplates" && <SelectRuleTemplates />}
			{currentPage === "ruleDetails" && <RuleDetails ruleDetails={ruleDetails} setRuleDetails={setRuleDetails} />}
		</>
	);
};

export default AddSuppressionRule;
