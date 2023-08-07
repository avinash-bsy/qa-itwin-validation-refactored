/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useCallback, useEffect, useMemo, useState } from "react";
import { actions, ActionType, MetaBase, TableState } from "react-table";
import { StagePanelLocation, StagePanelSection, UiItemsProvider, WidgetState, Widget } from "@itwin/appui-react";
import { Table, DefaultCell, IconButton, ExpandableBlock } from "@itwin/itwinui-react";
import { useClashContext } from "../context/ClashContext";
import ClashReviewApi from "../configs/ClashReviewApi";
import { SvgGoToStart, SvgHistory } from "@itwin/itwinui-icons-react";

interface TableRow extends Record<string, string> {
	time: string;
	count: string;
}

const ClashRunsWidget = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<"runsWidget" | "clashHistory">("runsWidget")
	const { runs, setRuns, setNewRunRequested, setClashResults, runId, testId, setRunId, iTwinId } = useClashContext();

	const getJobStatusText = useCallback((jobStatus: string) => {
		const statusMap: { [id: string]: any } = {
			"-1": "Queued",
			"0": "Started",
			"1": "Completed",
			"2": "Failed",
			"3": "DownloadingiModel",
			"4": "StoringResults",
			"5": "ValidationInProgress",
			"6": "ValidationLimited",
			"7": "Cancelled",
			"8": "FailedSuppressionRules",
			"9": "CompletedWithElementLoadErrors",
		};

		return statusMap[jobStatus];
	}, []);

	const columnDefinition = useMemo(
		() => [
			{
				Header: "Table",
				columns: [
					{
						Header: "Time",
						accessor: "execution_time",
					},
					{
						Header: "Count",
						accessor: "count",
					},
					{
						Header: "Status",
						accessor: "job_status",
						cellRenderer: (props: any) => (
							<DefaultCell {...props}>{getJobStatusText(props.cellProps.row.original.job_status)}</DefaultCell>
						),
					},
					// {
					// 	Header: 'Action',
					// 	Cell: (props: any) => {
					// 		return <IconButton styleType="borderless" onClick={() => {
					// 			setCurrentPage("clashHistory")
					// 		}}><SvgHistory />
					// 		</IconButton>
					// 	}
					// }
				],
			},
		],
		[runs]
	);

	const onRowClick = useCallback(
		async (_: any, row: any) => {
			row.toggleRowSelected(true);
			setRunId(row.original.id);
		},
		[runs]
	);

	const tableStateSingleSelectReducer = (newState: any, action: any): any => {
		switch (action.type) {
			case actions.toggleRowSelected: {
				return { ...newState, selectedRowIds: { [action.id]: action.value } };
			}
			default:
				break;
		}
		return newState;
	};

	const getClashRuns = async () => {
		setIsLoading(true);
		const clashRuns = await ClashReviewApi.getClashRuns(iTwinId, testId);
		setRunId(clashRuns[0]?.id);
		setRuns(clashRuns);
		setIsLoading(false);
	};

	useEffect(() => {
		const removeListener = ClashReviewApi.onResultStatusChanged.addListener(
			(clashTestRuns: any, exitCode: boolean, selectedRunId: string, clashResultData: any) => {
				setRuns((runs) => {
					return [...clashTestRuns];
				});

				if (runId === selectedRunId) {
					setClashResults([...clashResultData]);
				}

				if (exitCode) {
					setNewRunRequested(null);
				}
			}
		);

		return () => {
			removeListener();
		};
	}, [runId]);

	const historyColumnDefinition = [{
		Header: "Table",
		columns: [
			{
				Header: "Changeset",
				accessor: "changesetName"

			},
			{
				Header: "New",
				accessor: "status.new",
			},
			{
				Header: "Open",
				accessor: "status.open",
			},
			{
				Header: "Resolved",
				accessor: "status.resolved"
			},
			{
				Header: "Time",
				accessor: "executedAt",
				cellRenderer: (props: any) => (
					<DefaultCell {...props}>{new Date(props.cellProps.row.original.executedAt).toLocaleDateString()}</DefaultCell>
				),
			}
		]
	}]

	const onExpand = () => {
	}

	useEffect(() => {
		if (testId) {
			getClashRuns();
		}
	}, [testId]);

	return (
		<div>
			{
				currentPage === "runsWidget" && <Table<TableRow>
					data={runs}
					columns={columnDefinition}
					onRowClick={onRowClick}
					isLoading={isLoading}
					initialState={{
						selectedRowIds: {
							0: true,
						},
					}}
					stateReducer={tableStateSingleSelectReducer}
					emptyTableContent={"No runs"}
					density="extra-condensed"
					style={{ height: "100%" }}
					subComponent={ClashHistory}
					onExpand={onExpand}
				/>
			}
			{
				currentPage === "clashHistory" && <div>
					{/* <IconButton 
						onClick={() => {
							setCurrentPage("runsWidget")
						}} 
						styleType="borderless"
					>
						<SvgGoToStart style={{ height: 22, width: 22 }} />
					</IconButton>
					<Table
						data={clashHistory}
						columns={historyColumnDefinition}
						emptyTableContent={"No history"}
						density="extra-condensed"
					/> */}
				</div>
			}
		</div>
		
	);
};

export class ClashRunsWidgetProvider implements UiItemsProvider {
	public readonly id: string = "ClashRunsWidgetProvider";

	public provideWidgets(
		_stageId: string,
		_stageUsage: string,
		location: StagePanelLocation,
		_section?: StagePanelSection
	): ReadonlyArray<Widget> {
		const widgets: Widget[] = [];
		if (location === StagePanelLocation.Left && _section === StagePanelSection.End) {
			widgets.push({
				id: "ClashRunsWidget",
				label: "Runs",
				defaultState: WidgetState.Open,
				content: <ClashRunsWidget />,
			});
		}
		return widgets;
	}
}

const ClashHistory = (row:any) => {
	const {iTwinId} = useClashContext()
	const clashHistory = useMemo(() => [
        {
            "testRunId": "+njd+O6c/55j7MK4E9efqA==",
            "reportId": "54afd334-cd72-48e4-b104-3f537d68e845",
            "executedAt": "2023-06-27T14:07:25.353Z",
            "changesetId": "307ee154e1c5e394c26793265ae353cc898979c5",
            "changesetName": "Latest",
            "namedVersionId": "19b5d021-ebe0-4029-b366-7ff4aee338af",
            "status": {
                "new": 0,
                "open": 25,
                "resolved": 0
            },
            "configurationType": 2
        },
        {
            "testRunId": "FlXYcUOF6+CAp1KkbFv8DA==",
            "reportId": "54afd334-cd72-48e4-b104-3f537d68e845",
            "executedAt": "2023-06-27T13:58:12.536Z",
            "changesetId": "307ee154e1c5e394c26793265ae353cc898979c5",
            "changesetName": "Latest",
            "namedVersionId": "19b5d021-ebe0-4029-b366-7ff4aee338af",
            "status": {
                "new": 0,
                "open": 25,
                "resolved": 0
            },
            "configurationType": 2
        },
        {
            "testRunId": "RfCWDgZO4/2AwjcyJmJ2Cw==",
            "reportId": "54afd334-cd72-48e4-b104-3f537d68e845",
            "executedAt": "2023-06-23T06:37:06.131Z",
            "changesetId": "307ee154e1c5e394c26793265ae353cc898979c5",
            "changesetName": "Latest",
            "namedVersionId": "19b5d021-ebe0-4029-b366-7ff4aee338af",
            "status": {
                "new": 0,
                "open": 25,
                "resolved": 0
            },
            "configurationType": 2
        }
    ], [])

	useEffect(() => {
		const initApp = async () => {
			const clashHistory = await ClashReviewApi.getClashEvolutionDetails(iTwinId, "2892620a-a9b3-4f2a-bb9e-c1012ee1ce9c")
			console.log(clashHistory)
		}

		initApp()
	}, [])

	return <div style={{width:"100%"}}>
		{
			clashHistory.map((row:any) => (
				<div key={row.testRunId} >
					<ExpandableBlock title={new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'medium'}).format(new Date(row.executedAt))} style={{width:"90%", margin:"auto"}}>
						<span style={{fontSize:"16px"}}><strong>{row.changesetName}</strong></span>
						<hr />
						<table style={{width : "100%"}}>
							<tr>
								<th style={{textAlign:"center"}}>New</th>
								<th style={{textAlign:"center"}}>Open</th>
								<th style={{textAlign:"center"}}>Resolved</th>
							</tr>
							<tr>
								<td style={{textAlign:"center"}}>{row.status.new}</td>
								<td style={{textAlign:"center"}}>{row.status.open}</td>
								<td style={{textAlign:"center"}}>{row.status.resolved}</td>
							</tr>
						</table>
					</ExpandableBlock>
				</div>
			))
		}
	</div>
}
