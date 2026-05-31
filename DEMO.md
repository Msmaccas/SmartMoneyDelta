# Demo guide

This guide walks you through a quick demonstration of SmartMoneyDelta using the synthetic fixture data included in this repository.

## 1. Install dependencies

Run the following command from the root of the repository:

```bash
npm ci
```

This installs all package dependencies using the lockfile. Do not use `npm install` because it may update the lockfile unexpectedly.

## 2. Build the project

Compile all TypeScript packages and the web app:

```bash
npm run build
```

This runs `tsc` in each package and `vite build` for the web app.

## 3. Run the smoke path

The smoke script executes the workflow on the synthetic data, prints a short summary to the console and generates a Markdown report in the `reports/` directory:

```bash
npm run smoke
```

You should see output similar to:

```
Running SmartMoneyDelta smoke test...
Cases: 2
1. Acme Corp divergenceScore=1000006.00 reason=Acme Corp: Positive insider/ownership signals are not yet reflected in the price.
2. Beta Ltd divergenceScore=-500003.00 reason=Beta Ltd: Negative or weak signals contrast with a rising price.
Smoke report written to reports/smoke-board-<timestamp>.md
```

Open the generated report in a Markdown viewer to see the ranked board.

## 4. Start the API server

Launch the Express API on port 3000:

```bash
npm start
```

The server exposes the following endpoints:

- `GET /api/health` – simple health check.  
- `GET /api/board` – returns the current divergence board as JSON.  
- `GET /api/case/<id>` – returns the details for a specific case.

## 5. Run the web dashboard

In a separate terminal, start the Vite development server for the React dashboard:

```bash
npm --workspace apps/web run dev
```

Navigate to `http://localhost:5173` in your browser. You should see a table of divergence cases. Click a row to view the detailed case page.

## 6. Explore and extend

Review the code in the `packages` directory to understand how providers, agents, workflows and reports are implemented.  
To plug in your own data, set the `FIXTURE_PATH` environment variable to point to a JSON file with a compatible structure or write new provider classes in `packages/providers`.