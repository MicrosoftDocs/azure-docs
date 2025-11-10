### Configuring dbt Jobs
When creating or editing a dbt job, click the dbt configurations button to open the profile setup page. Here, you’ll define how your dbt job connects to your data warehouse.



Use **dbt configurations** to set (or review) your dbt Profile:

- **Adapter**: `DataWarehouse` (default in Fabric)
- **Connection name**: e.g., `dbtsampledemowarehouse`
- **Schema** *(required)*: e.g., `jaffle_shop_demo`
- **Seed data**: optionally enable to load CSVs from `/seeds` as managed tables

**Steps**
1. Open your dbt job → click **dbt configurations**.
2. Confirm the **Adapter** (default is **DataWarehouse**).
3. Verify **Connection name**.
4. Enter **Schema** (e.g., `jaffle_shop_demo`).
5. (Optional) Check **Seed date** if you want to load CSVs on `dbt seed` or `dbt build`.
6. Click **Apply**.

<img src="images\dbtconfigs.png" width="700px" />



#### Change adapter (when and how)

**What it is:** A control at the top‑left of the **dbt configurations** page that lets you change the dbt adapter used by the job’s Profile.

**When to use it**
- Your workspace connection changes (e.g., moving to a different Fabric Data Warehouse).
- You’re creating demos that contrast adapters (e.g., a future PostgreSQL path), or you cloned a job and need to point it to a new target.
- You’re standardizing schemas across environments (dev → test → prod) and need a different connection behind the scenes.

**What changes when you switch**
- The **Adapter** and **Connection** backing the Profile.
- Dependent fields (e.g., **Schema**) may need re‑validation.
- Runtime behavior must align with the adapter’s SQL dialect and capabilities.