export * from "./index.safe";

export * from "./classes";
export * from "./helpers";
export * from "./outdated.types";

export * as ipcRenderer from "./ipc";
export * as redux from "./redux";

import { observePromise } from "./helpers/observable";

observePromise("div[class^='_mainContainer'] > div[class^='_bar'] > div[class^='_title']", 30000).then((title) => {
	if (title !== null) title.innerHTML = 'TIDA<b><span style="color: #32f4ff;">Luna</span></b>	<span style="color: red;">BETA</span>';
});

export { errSignal } from "./index.safe";
