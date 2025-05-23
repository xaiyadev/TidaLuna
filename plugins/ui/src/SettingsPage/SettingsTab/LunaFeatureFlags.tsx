import { redux } from "@luna/lib";
import React from "react";
import { LunaSettings, LunaSwitchSetting } from "../../components";

import Grid from "@mui/material/Grid";

import SettingsIcon from "@mui/icons-material/Settings";
import { grey } from "@mui/material/colors";
import { SpinningButton } from "../../components/SpinningButton";

type FeatureFlag<K extends string = string> = {
	created: number;
	name: K;
	type: "BOOLEAN";
	value: boolean;
};
type FeatureFlags = {
	flags: { [K in string]: FeatureFlag<K> };
};

const getFeatureFlags = (): FeatureFlags => redux.store.getState().featureFlags;

export const LunaFeatureFlags = React.memo(() => {
	const [featureFlags, setFeatureFlags] = React.useState(getFeatureFlags());
	const [hide, setHidden] = React.useState(false);

	const setFlag = React.useCallback((flag: FeatureFlag) => {
		redux.actions["featureFlags/SET_FLAGS"]({ [flag.name]: { ...flag, value: !flag.value } });
		setFeatureFlags(getFeatureFlags());
	}, []);
	return (
		<LunaSettings
			title="Feature flags"
			desc="Feature flags & experiments currently in the Tidal desktop app. These are internal from Tidal and not Luna features"
			titleChildren={
				<SpinningButton title={hide ? "Show flags" : "Hide flags"} onClick={() => setHidden(!hide)} icon={SettingsIcon} sxColor={grey.A400} />
			}
		>
			{!hide && (
				<Grid spacing={2} container>
					{Object.values(featureFlags.flags)
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((flag) => (
							<Grid
								key={flag.name}
								size={6}
								sx={{ borderRadius: 4, backgroundColor: "rgba(0, 0, 0, 0.20)", boxShadow: 2, paddingLeft: 1.5 }}
								children={
									<LunaSwitchSetting
										disabled={flag.type !== "BOOLEAN"}
										title={flag.name[0].toUpperCase() + flag.name.slice(1).replaceAll("-", " ")}
										onClick={setFlag.bind(null, flag)}
										checked={flag.value}
									/>
								}
							/>
						))}
				</Grid>
			)}
		</LunaSettings>
	);
});
