## Create dbt Jobs

### Overview
To create a dbt job in Fabric:

1. Navigate to your Fabric **workspace**.
2. Select **New item > dbt job** from the item creation menu.
3. Enter a name and select a location.
<img src="images\dbtjob.png"  />
4. Choose the target **Fabric Data Warehouse** connection.
5. Configure job parameters and save the new dbt job item.

Once created, you can open the dbt job to view its file structure, configure settings, and run dbt commands directly from the Fabric UI.

<img src="images\dbtmenu.png"/>
---

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

<img src="images\dbtconfigs.png" />