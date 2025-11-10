## dbt Job Settings and Commands

### Settings and Tabs
Each dbt job in Fabric includes key tabs to help manage your project:

- **Explorer:** View and organize files such as models, seeds, and YAML configs.
- **Settings:** Adjust adapter configurations like schema, connection, and concurrency.
- **Output Panel:** View run logs, job output, and error messages in real time.

This layout mirrors the dbt developer workflow but provides a streamlined, UI-based experience for Fabric users.



### Supported Commands
Fabric supports the following core dbt commands directly from the dbt job interface:

| Command | Description |
|----------|-------------|
| **dbt build** | Builds all models, seeds, and tests in the project. |
| **dbt run** | Executes all SQL models in dependency order. |
| **dbt seed** | Loads CSV files from the `seeds/` directory. |
| **dbt test** | Runs schema and data tests defined in `schema.yml`. |
| **dbt compile** | Generates compiled SQL without executing transformations. |
| **dbt snapshot** | Captures and tracks slowly changing dimensions over time. |

---

### Advanced Selectors
You can selectively run or exclude specific models using selectors:

```
dbt run --select my_model
dbt build --select staging.*
dbt build --exclude deprecated_models
```

Selectors let you target parts of your pipeline for faster iteration during development or testing.

--


### dbt Version Supported
Fabric currently supports **dbt Core v1.7** (subject to periodic updates).
Microsoft maintains alignment with major dbt Core releases to ensure compatibility and feature parity. Updates are applied automatically, with notifications in the Fabric release notes.

---

### Adapters Supported
The following dbt adapters are supported in Microsoft Fabric:
- **Microsoft Fabric Lakehouse**
- **Microsoft Fabric Warehouse**
- **Azure SQL database e**
- **PostgreSQL**
- **Snowflake**


Each adapter supports its respective connection parameters and SQL dialect.

