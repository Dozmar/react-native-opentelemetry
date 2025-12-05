const { readFileSync } = require("fs");
const path = require("path");
const { getConfig } = require("react-native-builder-bob/babel-config");

const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

module.exports = (api) => {
	api.cache(true);

	return getConfig(
		{
			presets: ["babel-preset-expo"],
		},
		{ root, pkg }
	);
};
