import { Button, ModalButtonBar, ModalContent, ProgressRadial } from "@itwin/itwinui-react";
import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import RuleDetails from "./RuleDetails";
import { PageList } from "./SuppressionRulesModal";
import ClashReviewApi from "../../configs/ClashReviewApi";
import { useClashContext } from "../../context/ClashContext";
import { SvgGoToStart } from "@itwin/itwinui-icons-react";

interface EditSuppressionRuleProps {
	setCurrentPage: Dispatch<SetStateAction<PageList>>;
	selectedRuleForEdit: string;
}

const EditSuppressionRule: FunctionComponent<EditSuppressionRuleProps> = ({ selectedRuleForEdit, setCurrentPage }) => {
	const [ruleDetails, setRuleDetails] = useState<Record<string, any>>({});
	const [loading, setLoading] = useState<boolean>(false);
	const { iTwinId } = useClashContext();

	const updateSuppressionRule = async () => {
		setLoading(true);
		const requestBody = {
			name: ruleDetails.name,
			reason: ruleDetails.reason,
			parameters: {
				queries: {
					type: 1,
					queryReference: `${ruleDetails.mappingId}:[${ruleDetails.groupingIds?.map((id: string) => id)}]`,
				},
			},
		};

		const response = await ClashReviewApi.updateSuppressionRule(iTwinId, selectedRuleForEdit, requestBody);
		setLoading(false);
		console.log(response);
	};

	return (
		<>
			<ModalContent className="customModal">
				{loading ? (
					<ProgressRadial indeterminate={true} />
				) : (
					<RuleDetails ruleDetails={ruleDetails} setRuleDetails={setRuleDetails} selectedRuleForEdit={selectedRuleForEdit} />
				)}
			</ModalContent>
			<ModalButtonBar style={{ justifyContent: "space-between" }}>
				<div>
					<Button onClick={() => setCurrentPage("listRules")}>
						<SvgGoToStart style={{ width: "25", height: "25" }} />
					</Button>
				</div>
				<Button styleType="high-visibility" onClick={updateSuppressionRule}>
					Update
				</Button>
			</ModalButtonBar>
		</>
	);
};

export default EditSuppressionRule;
