const fs = require("fs-extra");
const path = require("path");

async function run() {

    const source =
        "/workspace/development/frappe-bench/apps/insights/frontend/src2";

    const compiled =
        path.join(__dirname, "frontend/src_compiled");

    const overrides =
        path.join(__dirname, "frontend/src_overrides");

    await fs.emptyDir(compiled);

    await fs.copy(source, compiled);

    await fs.copy(overrides, compiled, {
        overwrite: true
    });

    console.log("Overrides applied");
}

run();