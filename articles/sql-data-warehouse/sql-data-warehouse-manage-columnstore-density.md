
```
SELECT 	SYSDATETIME()                                                     		AS 'Collection Date'
,		DB_Name()                                                        		AS 'Database Name'
,		t.name                                                           		AS 'Table Name'
,		SUM(CASE WHEN rg.[State] = 1 THEN 1                   ELSE 0    END)	AS 'Nmbr of OPEN Row Groups'
,		SUM(CASE WHEN rg.[State] = 1 THEN rg.[Total_rows]     ELSE 0    END)	AS 'Rows in OPEN Row Groups'
,		MIN(CASE WHEN rg.[State] = 1 THEN rg.[Total_rows]     ELSE NULL END)	AS 'MIN OPEN Row Group Rows'
,		MAX(CASE WHEN rg.[State] = 1 THEN rg.[Total_rows]     ELSE NULL END)	AS 'MAX OPEN_Row Group Rows'
,		AVG(CASE WHEN rg.[State] = 1 THEN rg.[Total_rows]     ELSE NULL END)	AS 'AVG OPEN_Row Group Rows'
,		SUM(CASE WHEN rg.[State] = 2 THEN 1					  ELSE 0    END)	AS 'Nmbr of CLOSED Row Groups'
,		SUM(CASE WHEN rg.[State] = 2 THEN rg.[Total_rows]     ELSE 0    END)	AS 'Rows in CLOSED_Row Groups'
,       MIN(CASE WHEN rg.[State] = 2 THEN rg.[Total_rows]     ELSE NULL END) 	AS 'MIN CLOSED Row Group Rows'
,		MAX(CASE WHEN rg.[State] = 2 THEN rg.[Total_rows]     ELSE NULL END)	AS 'MAX CLOSED Row Group Rows'
,		AVG(CASE WHEN rg.[State] = 2 THEN rg.[Total_rows]     ELSE NULL END)	AS 'AVG CLOSED Row Group Rows'
,		SUM(CASE WHEN rg.[State] = 3 THEN 1				      ELSE 0    END)	AS 'Nmbr of COMPRESSED Row Groups'
,		SUM(CASE WHEN rg.[State] = 3 THEN rg.[Total_rows]     ELSE 0    END)	AS 'Rows in COMPRESSED Row Groups'
,		SUM(CASE WHEN rg.[State] = 3 THEN rg.[Deleted_rows]   ELSE 0    END)	AS 'Deleted Rows in COMPRESSED Row Groups'
,       MIN(CASE WHEN rg.[State] = 3 THEN rg.[Total_rows]     ELSE NULL END) 	AS 'MIN COMPRESSED Row Group Rows'
,		MAX(CASE WHEN rg.[State] = 3 THEN rg.[Total_rows]     ELSE NULL END)	AS 'MAX COMPRESSED Row Group Rows'
,		AVG(CASE WHEN rg.[State] = 3 THEN rg.[Total_rows]     ELSE NULL END)	AS 'AVG COMPRESSED Row Group Rows'
FROM 		sys.[pdw_nodes_column_store_row_groups] rg
JOIN 		sys.[pdw_nodes_tables] nt               	ON 	rg.[object_id]			= nt.[object_id]
          												AND rg.[pdw_node_id]		= nt.[pdw_node_id]
														AND rg.[distribution_id]	= nt.[distribution_id]
JOIN     	sys.[pdw_table_mappings] mp             	ON 	nt.[name]				= mp.[physical_name]
JOIN  		sys.[tables] t                          	ON 	mp.[object_id]			= t.[object_id]
GROUP BY 	t.[name]
;
```