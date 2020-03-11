---
title: T-SQL language elements
description: Links to the documentation for T-SQL language elements supported in SQL Analytics.
services: sql-analytics
author: filippopovic
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice:
ms.date: 02/26/2020
ms.author: fipopovi
ms.reviewer: jrasnick
---

# T-SQL language elements supported in SQL Analytics
Links to the documentation for T-SQL language elements supported in SQL Analytics.

## Core elements

| Element                                                      | SQL pool | SQL on-demand |
| ------------------------------------------------------------ | -------- | ------------- |
| [syntax conventions](/sql/t-sql/language-elements/transact-sql-syntax-conventions-transact-sql) | Yes      | Yes           |
| [object naming rules](https://msdn.microsoft.com/library/ms175874.aspx) | Yes      | Yes           |
| [reserved keywords](https://msdn.microsoft.com/library/ms189822.aspx) | Yes      | Yes           |
| [collations](https://msdn.microsoft.com/library/ff848763.aspx) | Yes      | Yes           |
| [comments](https://msdn.microsoft.com/library/ms181627.aspx) | Yes      | Yes           |
| [constants](https://msdn.microsoft.com/library/ms179899.aspx) | Yes      | Yes           |
| [data types](https://msdn.microsoft.com/library/ms187752.aspx) | Yes      | Yes           |
| [EXECUTE](https://msdn.microsoft.com/library/ms188332.aspx)  | Yes      | Yes           |
| [expressions](https://msdn.microsoft.com/library/ms190286.aspx) | Yes      | Yes           |
| [KILL](https://msdn.microsoft.com/library/ms173730.aspx)     | Yes      | Yes           |
| [IDENTITY property workaround](https://msdn.microsoft.com/library/ms186775.aspx) | Yes      | Yes           |
| [PRINT](https://msdn.microsoft.com/library/ms176047.aspx)    | Yes      | Yes           |
| [USE](https://msdn.microsoft.com/library/ms188366.aspx)      | Yes      | Yes           |



## Batches, control-of-flow, and variables

| Element                                                      | SQL pool | SQL on-demand |
| ------------------------------------------------------------ | -------- | ------------- |
| [BEGIN...END](https://msdn.microsoft.com/library/ms190487.aspx) | Yes      | Yes           |
| [BREAK](https://msdn.microsoft.com/library/ms181271.aspx)    | Yes      | Yes           |
| [DECLARE @local_variable](https://msdn.microsoft.com/library/ms188927.aspx) | Yes      | Yes           |
| [IF...ELSE](https://msdn.microsoft.com/library/ms182717.aspx) | Yes      | Yes           |
| [RAISERROR](https://msdn.microsoft.com/library/ms178592.aspx) | Yes      | Yes           |
| [SET@local_variable](https://msdn.microsoft.com/library/ms189484.aspx) | Yes      | Yes           |
| [THROW](https://msdn.microsoft.com/library/ee677615.aspx)    | Yes      | Yes           |
| [TRY...CATCH](https://msdn.microsoft.com/library/ms175976.aspx) | Yes      | Yes           |
| [WHILE](https://msdn.microsoft.com/library/ms178642.aspx)    | Yes      | Yes           |



## Operators
| Operator                                                     | SQL pool | SQL on-demand |
| ------------------------------------------------------------ | -------- | ------------- |
| [+ (Add)](https://msdn.microsoft.com/library/ms178565.aspx)  | Yes      | Yes           |
| [+ (String Concatenation)](https://msdn.microsoft.com/library/ms177561.aspx) | Yes      | Yes           |
| [- (Negative)](https://msdn.microsoft.com/library/ms189480.aspx) | Yes      | Yes           |
| [- (Subtract)](https://msdn.microsoft.com/library/ms189518.aspx) | Yes      | Yes           |
| [(Multiply)](https://msdn.microsoft.com/library/ms176019.aspx) | Yes      | Yes           |
| [/ (Divide)](https://msdn.microsoft.com/library/ms175009.aspx) | Yes      | Yes           |
| [Modulo](https://msdn.microsoft.com/library/ms190279.aspx)   | Yes      | Yes           |



## Wildcard character(s) to match
|                                                              | SQL pool | SQL on-demand |
| ------------------------------------------------------------ | -------- | ------------- |
| [= (Equals)](https://msdn.microsoft.com/library/ms175118.aspx) | Yes      | Yes           |
| [> (Greater than)](https://msdn.microsoft.com/library/ms178590.aspx) | Yes      | Yes           |
| [< (Less than)](https://msdn.microsoft.com/library/ms179873.aspx) | Yes      | Yes           |
| [>= (Great than or equal to)](https://msdn.microsoft.com/library/ms181567.aspx) | Yes      | Yes           |
| [<= (Less than or equal to)](https://msdn.microsoft.com/library/ms174978.aspx) | Yes      | Yes           |
| [<> (Not equal to)](https://msdn.microsoft.com/library/ms176020.aspx) | Yes      | Yes           |
| [!= (Not equal to)](https://msdn.microsoft.com/library/ms190296.aspx) | Yes      | Yes           |
| [AND](https://msdn.microsoft.com/library/ms188372.aspx)      | Yes      | Yes           |
| [BETWEEN](https://msdn.microsoft.com/library/ms187922.aspx)  | Yes      | Yes           |
| [EXISTS](https://msdn.microsoft.com/library/ms188336.aspx)   | Yes      | Yes           |
| [IN](https://msdn.microsoft.com/library/ms177682.aspx)       | Yes      | Yes           |
| [IS [NOT] NULL](https://msdn.microsoft.com/library/ms188795.aspx) | Yes      | Yes           |
| [LIKE](https://msdn.microsoft.com/library/ms179859.aspx)     | Yes      | Yes           |
| [NOT](https://msdn.microsoft.com/library/ms189455.aspx)      | Yes      | Yes           |
| [OR](https://msdn.microsoft.com/library/ms188361.aspx)       | Yes      | Yes           |



### Bitwise operators
| Operator                                                     | SQL pool | SQL on-demand |
| ------------------------------------------------------------ | -------- | ------------- |
| [& (Bitwise AND)](https://msdn.microsoft.com/library/ms174965.aspx) | Yes      | Yes           |
| [\|_(Bitwise OR)](https://msdn.microsoft.com/library/ms186714.aspx) | Yes      | Yes           |
| [^ (Bitwise exclusive OR)](https://msdn.microsoft.com/library/ms190277.aspx) | Yes      | Yes           |
| [~ (Bitwise NOT)](https://msdn.microsoft.com/library/ms173468.aspx) | Yes      | Yes           |
| [^= (Bitwise Exclusive OR EQUALS)](https://msdn.microsoft.com/library/cc627413.aspx) | Yes      | Yes           |
| [\|= (Bitwise OR EQUALS)](https://msdn.microsoft.com/library/cc627409.aspx) | Yes      | Yes           |
| [&= (Bitwise AND EQUALS)](https://msdn.microsoft.com/library/cc627427.aspx) | Yes      | Yes           |



## Functions

| Function                                                     | SQL pool | SQL on-demand |
| ------------------------------------------------------------ | -------- | ------------- |
| [@@DATEFIRST](https://msdn.microsoft.com/library/ms187766.aspx) | Yes      | Yes           |
| [@@ERROR](https://msdn.microsoft.com/library/ms188790.aspx)  | Yes      | Yes           |
| [@@LANGUAGE](https://msdn.microsoft.com/library/ms177557.aspx) | Yes      | Yes           |
| [@@SPID](https://msdn.microsoft.com/library/ms189535.aspx)   | Yes      | Yes           |
| [@@TRANCOUNT](https://msdn.microsoft.com/library/ms187967.aspx) | Yes      | Yes           |
| [@@VERSION](https://msdn.microsoft.com/library/ms177512.aspx) | Yes      | Yes           |
| [ABS](https://msdn.microsoft.com/library/ms189800.aspx)      | Yes      | Yes           |
| [ACOS](https://msdn.microsoft.com/library/ms178627.aspx)     | Yes      | Yes           |
| [ASCII](https://msdn.microsoft.com/library/ms177545.aspx)    | Yes      | Yes           |
| [ASIN](https://msdn.microsoft.com/library/ms181581.aspx)     | Yes      | Yes           |
| [ATAN](https://msdn.microsoft.com/library/ms181746.aspx)     | Yes      | Yes           |
| [ATN2](https://msdn.microsoft.com/library/ms173854.aspx)     | Yes      | Yes           |
| [BINARY_CHECKSUM](https://msdn.microsoft.com/library/ms173784.aspx) | Yes      | No            |
| [CASE](https://msdn.microsoft.com/library/ms181765.aspx)     | Yes      | Yes           |
| [CAST and CONVERT](https://msdn.microsoft.com/library/ms187928.aspx) | Yes      | Yes           |
| [CEILING](https://msdn.microsoft.com/library/ms189818.aspx)  | Yes      | Yes           |
| [CHAR](https://msdn.microsoft.com/library/ms187323.aspx)     | Yes      | Yes           |
| [CHARINDEX](https://msdn.microsoft.com/library/ms186323.aspx) | Yes      | Yes           |
| [CHECKSUM](https://msdn.microsoft.com/library/ms189788.aspx) | Yes      | No            |
| [COALESCE](https://msdn.microsoft.com/library/ms190349.aspx) | Yes      | Yes           |
| [COL_NAME](https://msdn.microsoft.com/library/ms174974.aspx) | Yes      | Yes           |
| [COLLATIONPROPERTY](https://msdn.microsoft.com/library/ms190305.aspx) | Yes      | Yes           |
| [CONCAT](https://msdn.microsoft.com/library/hh231515.aspx)   | Yes      | Yes           |
| [COS](https://msdn.microsoft.com/library/ms188919.aspx)      | Yes      | Yes           |
| [COT](https://msdn.microsoft.com/library/ms188921.aspx)      | Yes      | Yes           |
| [COUNT](https://msdn.microsoft.com/library/ms175997.aspx)    | Yes      | Yes           |
| [COUNT_BIG](https://msdn.microsoft.com/library/ms190317.aspx) | Yes      | Yes           |
| [CUME_DIST](https://msdn.microsoft.com/library/hh231078.aspx) | Yes      | Yes           |
| [CURRENT_TIMESTAMP](https://msdn.microsoft.com/library/ms188751.aspx) | Yes      | Yes           |
| [CURRENT_USER](https://msdn.microsoft.com/library/ms176050.aspx) | Yes      | Yes           |
| [DATABASEPROPERTYEX](https://msdn.microsoft.com/library/ms186823.aspx) | Yes      | Yes           |
| [DATALENGTH](https://msdn.microsoft.com/library/ms173486.aspx) | Yes      | Yes           |
| [DATEADD](https://msdn.microsoft.com/library/ms186819.aspx)  | Yes      | Yes           |
| [DATEDIFF](https://msdn.microsoft.com/library/ms189794.aspx) | Yes      | Yes           |
| [DATEFROMPARTS](https://msdn.microsoft.com/library/hh213228.aspx) | Yes      | Yes           |
| [DATENAME](https://msdn.microsoft.com/library/ms174395.aspx) | Yes      | Yes           |
| [DATEPART](https://msdn.microsoft.com/library/ms174420.aspx) | Yes      | Yes           |
| [DATETIME2FROMPARTS](https://msdn.microsoft.com/library/hh213312.aspx) | Yes      | Yes           |
| [DATETIMEFROMPARTS](https://msdn.microsoft.com/library/hh213233.aspx) | Yes      | Yes           |
| [DATETIMEOFFSETFROMPARTS](https://msdn.microsoft.com/library/hh231077.aspx) | Yes      | Yes           |
| [DAY](https://msdn.microsoft.com/library/ms176052.aspx)      | Yes      | Yes           |
| [DB_ID](https://msdn.microsoft.com/library/ms186274.aspx)    | Yes      | Yes           |
| [DB_NAME](https://msdn.microsoft.com/library/ms189753.aspx)  | Yes      | Yes           |
| [DEGREES](https://msdn.microsoft.com/library/ms178566.aspx)  | Yes      | Yes           |
| [DENSE_RANK](https://msdn.microsoft.com/library/ms173825.aspx) | Yes      | Yes           |
| [DIFFERENCE](https://msdn.microsoft.com/library/ms188753.aspx) | Yes      | Yes           |
| [EOMONTH](https://msdn.microsoft.com/library/hh213020.aspx)  | Yes      | Yes           |
| [ERROR_MESSAGE](https://msdn.microsoft.com/library/ms190358.aspx) | Yes      | Yes           |
| [ERROR_NUMBER](https://msdn.microsoft.com/library/ms175069.aspx) | Yes      | Yes           |
| [ERROR_PROCEDURE](https://msdn.microsoft.com/library/ms188398.aspx) | Yes      | Yes           |
| [ERROR_SEVERITY](https://msdn.microsoft.com/library/ms178567.aspx) | Yes      | Yes           |
| [ERROR_STATE](https://msdn.microsoft.com/library/ms180031.aspx) | Yes      | Yes           |
| [EXP](https://msdn.microsoft.com/library/ms179857.aspx)      | Yes      | Yes           |
| [FIRST_VALUE](https://msdn.microsoft.com/library/hh213018.aspx) | Yes      | Yes           |
| [FLOOR](https://msdn.microsoft.com/library/ms178531.aspx)    | Yes      | Yes           |
| [GETDATE](https://msdn.microsoft.com/library/ms188383.aspx)  | Yes      | Yes           |
| [GETUTCDATE](https://msdn.microsoft.com/library/ms178635.aspx) | Yes      | Yes           |
| [HAS_DBACCESS](https://msdn.microsoft.com/library/ms187718.aspx) | Yes      | Yes           |
| [HASHBYTES](https://msdn.microsoft.com/library/ms174415.aspx) | Yes      | Yes           |
| [INDEXPROPERTY](https://msdn.microsoft.com/library/ms187729.aspx) | Yes      | Yes           |
| [ISDATE](https://msdn.microsoft.com/library/ms187347.aspx)   | Yes      | Yes           |
| [ISNULL](https://msdn.microsoft.com/library/ms184325.aspx)   | Yes      | Yes           |
| [ISNUMERIC](https://msdn.microsoft.com/library/ms186272.aspx) | Yes      | Yes           |
| [LAG](https://msdn.microsoft.com/library/hh231256.aspx)      | Yes      | Yes           |
| [LAST_VALUE](https://msdn.microsoft.com/library/hh231517.aspx) | Yes      | Yes           |
| [LEAD](https://msdn.microsoft.com/library/hh213125.aspx)     | Yes      | Yes           |
| [LEFT](https://msdn.microsoft.com/library/ms177601.aspx)     | Yes      | Yes           |
| [LEN](https://msdn.microsoft.com/library/ms190329.aspx)      | Yes      | Yes           |
| [LOG](https://msdn.microsoft.com/library/ms190319.aspx)      | Yes      | Yes           |
| [LOG10](https://msdn.microsoft.com/library/ms175121.aspx)    | Yes      | Yes           |
| [LOWER](https://msdn.microsoft.com/library/ms174400.aspx)    | Yes      | Yes           |
| [LTRIM](https://msdn.microsoft.com/library/ms177827.aspx)    | Yes      | Yes           |
| [MAX](https://msdn.microsoft.com/library/ms187751.aspx)      | Yes      | Yes           |
| [MIN](https://msdn.microsoft.com/library/ms179916.aspx)      | Yes      | Yes           |
| [MONTH](https://msdn.microsoft.com/library/ms187813.aspx)    | Yes      | Yes           |
| [NCHAR](https://msdn.microsoft.com/library/ms182673.aspx)    | Yes      | Yes           |
| [NTILE](https://msdn.microsoft.com/library/ms175126.aspx)    | Yes      | Yes           |
| [NULLIF](https://msdn.microsoft.com/library/ms177562.aspx)   | Yes      | Yes           |
| [OBJECT_ID](https://msdn.microsoft.com/library/ms190328.aspx) | Yes      | Yes           |
| [OBJECT_NAME](https://msdn.microsoft.com/library/ms186301.aspx) | Yes      | Yes           |
| [OBJECTPROPERTY](https://msdn.microsoft.com/library/ms176105.aspx) | Yes      | Yes           |
| [OIBJECTPROPERTYEX](https://msdn.microsoft.com/library/ms188390.aspx) | Yes      | Yes           |
| [ODBCS scalar functions](https://msdn.microsoft.com/library/bb630290.aspx) | Yes      | Yes           |
| [OVER clause](https://msdn.microsoft.com/library/ms189461.aspx) | Yes      | Yes           |
| [PARSENAME](https://msdn.microsoft.com/library/ms188006.aspx) | Yes      | Yes           |
| [PATINDEX](https://msdn.microsoft.com/library/ms188395.aspx) | Yes      | Yes           |
| [PERCENTILE_CONT](https://msdn.microsoft.com/library/hh231473.aspx) | Yes      | Yes           |
| [PERCENTILE_DISC](https://msdn.microsoft.com/library/hh231327.aspx) | Yes      | Yes           |
| [PERCENT_RANK](https://msdn.microsoft.com/library/hh213573.aspx) | Yes      | Yes           |
| [PI](https://msdn.microsoft.com/library/ms189512.aspx)       | Yes      | Yes           |
| [POWER](https://msdn.microsoft.com/library/ms174276.aspx)    | Yes      | Yes           |
| [QUOTENAME](https://msdn.microsoft.com/library/ms176114.aspx) | Yes      | Yes           |
| [RADIANS](https://msdn.microsoft.com/library/ms189742.aspx)  | Yes      | Yes           |
| [RAND](https://msdn.microsoft.com/library/ms177610.aspx)     | Yes      | No            |
| [RANK](https://msdn.microsoft.com/library/ms176102.aspx)     | Yes      | Yes           |
| [REPLACE](https://msdn.microsoft.com/library/ms186862.aspx)  | Yes      | Yes           |
| [REPLICATE](https://msdn.microsoft.com/library/ms174383.aspx) | Yes      | Yes           |
| [REVERSE](https://msdn.microsoft.com/library/ms180040.aspx)  | Yes      | Yes           |
| [RIGHT](https://msdn.microsoft.com/library/ms177532.aspx)    | Yes      | Yes           |
| [ROUND](https://msdn.microsoft.com/library/ms175003.aspx)    | Yes      | Yes           |
| [ROW_NUMBER](https://msdn.microsoft.com/library/ms186734.aspx) | Yes      | Yes           |
| [RTRIM](https://msdn.microsoft.com/library/ms178660.aspx)    | Yes      | Yes           |
| [SCHEMA_ID](https://msdn.microsoft.com/library/ms188797.aspx) | Yes      | Yes           |
| [SCHEMA_NAME](https://msdn.microsoft.com/library/ms175068.aspx) | Yes      | Yes           |
| [SERVERPROPERTY](https://msdn.microsoft.com/library/ms174396.aspx) | Yes      | Yes           |
| [SESSION_USER](https://msdn.microsoft.com/library/ms177587.aspx) | Yes      | Yes           |
| [SIGN](https://msdn.microsoft.com/library/ms188420.aspx)     | Yes      | Yes           |
| [SIN](https://msdn.microsoft.com/library/ms188377.aspx)      | Yes      | Yes           |
| [SMALLDATETIMEFROMPARTS](https://msdn.microsoft.com/library/hh213396.aspx) | Yes      | Yes           |
| [SOUNDEX](https://msdn.microsoft.com/library/ms187384.aspx)  | Yes      | Yes           |
| [SPACE](https://msdn.microsoft.com/library/ms187950.aspx)    | Yes      | Yes           |
| [SQL_VARIANT_PROPERTY](https://msdn.microsoft.com/library/ms178550.aspx) | Yes      | No            |
| [SQRT](https://msdn.microsoft.com/library/ms176108.aspx)     | Yes      | Yes           |
| [SQUARE](https://msdn.microsoft.com/library/ms173569.aspx)   | Yes      | Yes           |
| [STATS_DATE](https://msdn.microsoft.com/library/ms190330.aspx) | Yes      | Yes           |
| [STDEV](https://msdn.microsoft.com/library/ms190474.aspx)    | Yes      | Yes           |
| [STDEVP](https://msdn.microsoft.com/library/ms176080.aspx)   | Yes      | Yes           |
| [STR](https://msdn.microsoft.com/library/ms189527.aspx)      | Yes      | Yes           |
| [STUFF](https://msdn.microsoft.com/library/ms188043.aspx)    | Yes      | Yes           |
| [SUBSTRING](https://msdn.microsoft.com/library/ms187748.aspx) | Yes      | Yes           |
| [SUM](https://msdn.microsoft.com/library/ms187810.aspx)      | Yes      | Yes           |
| [SUSER_SNAME](https://msdn.microsoft.com/library/ms174427.aspx) | Yes      | Yes           |
| [SWITCHOFFSET](https://msdn.microsoft.com/library/bb677244.aspx) | Yes      | Yes           |
| [SYSDATETIME](https://msdn.microsoft.com/library/bb630353.aspx) | Yes      | Yes           |
| [SYSDATETIMEOFFSET](https://msdn.microsoft.com/library/bb677334.aspx) | Yes      | Yes           |
| [SYSTEM_USER](https://msdn.microsoft.com/library/ms179930.aspx) | Yes      | Yes           |
| [SYSUTCDATETIME](https://msdn.microsoft.com/library/bb630387.aspx) | Yes      | Yes           |
| [TAN](https://msdn.microsoft.com/library/ms190338.aspx)      | Yes      | Yes           |
| [TERTIARY_WEIGHTS](https://msdn.microsoft.com/library/ms186881.aspx) | Yes      | Yes           |
| [TIMEFROMPARTS](https://msdn.microsoft.com/library/hh213398.aspx) | Yes      | Yes           |
| [TODATETIMEOFFSET](https://msdn.microsoft.com/library/bb630335.aspx) | Yes      | Yes           |
| [TYPE_ID](https://msdn.microsoft.com/library/ms181628.aspx)  | Yes      | Yes           |
| [TYPE_NAME](https://msdn.microsoft.com/library/ms189750.aspx) | Yes      | Yes           |
| [TYPEPROPERTY](https://msdn.microsoft.com/library/ms188419.aspx) | Yes      | Yes           |
| [UNICODE](https://msdn.microsoft.com/library/ms180059.aspx)  | Yes      | Yes           |
| [UPPER](https://msdn.microsoft.com/library/ms180055.aspx)    | Yes      | Yes           |
| [USER](https://msdn.microsoft.com/library/ms186738.aspx)     | Yes      | Yes           |
| [USER_NAME](https://msdn.microsoft.com/library/ms188014.aspx) | Yes      | Yes           |
| [VAR](https://msdn.microsoft.com/library/ms186290.aspx)      | Yes      | Yes           |
| [VARP](https://msdn.microsoft.com/library/ms188735.aspx)     | Yes      | Yes           |
| [YEAR](https://msdn.microsoft.com/library/ms186313.aspx)     | Yes      | Yes           |
| [XACT_STATE](https://msdn.microsoft.com/library/ms189797.aspx) | Yes      | No            |



## Transactions
Transactions are not supported in SQL on-demand. You can check [transactions](https://msdn.microsoft.com/library/mt204031.aspx) in SQL pool.

## Diagnostic sessions
Diagnostic sessions are not supported in SQL on-demand. You can check [CREATE DIAGNOSTICS SESSION](https://msdn.microsoft.com/library/mt204029.aspx) in SQL pool.

## Procedures

| Procedure                                                    | SQL pool | SQL on-demand |
| ------------------------------------------------------------ | -------- | ------------- |
| [sp_addrolemember](https://msdn.microsoft.com/library/ms187750.aspx) | Yes      | No            |
| [sp_columns](https://msdn.microsoft.com/library/ms176077.aspx) | Yes      | Yes           |
| [sp_configure](https://msdn.microsoft.com/library/ms188787.aspx) | Yes      | No            |
| [sp_datatype_info_90](https://msdn.microsoft.com/library/mt204014.aspx) | Yes      | No            |
| [sp_droprolemember](https://msdn.microsoft.com/library/ms188369.aspx) | Yes      | No            |
| [sp_execute](https://msdn.microsoft.com/library/ff848746.aspx) | Yes      | No            |
| [sp_executesql](https://msdn.microsoft.com/library/ms188001.aspx) | Yes      | Yes           |
| [sp_fkeys](https://msdn.microsoft.com/library/ms175090.aspx) | Yes      | Yes           |
| [sp_pdw_add_network_credentials](https://msdn.microsoft.com/library/mt204011.aspx) | Yes      | No            |
| [sp_pdw_database_encryption](https://msdn.microsoft.com/library/mt219360.aspx) | Yes      | No            |
| [sp_pdw_database_encryption_regenerate_system_keys](https://msdn.microsoft.com/library/mt204033.aspx) | Yes      | No            |
| [sp_pdw_log_user_data_masking](https://msdn.microsoft.com/library/mt204023.aspx) | Yes      | No            |
| [sp_pdw_remove_network_credentials](https://msdn.microsoft.com/library/mt204038.aspx) | Yes      | No            |
| [sp_pkeys](https://msdn.microsoft.com/library/ms189813.aspx) | Yes      | Yes           |
| [sp_prepare](https://msdn.microsoft.com/library/ff848808.aspx) | Yes      | No            |
| [sp_spaceused](https://msdn.microsoft.com/library/ms188776.aspx) | Yes      | No            |
| [sp_special_columns_100](https://msdn.microsoft.com/library/mt204025.aspx) | Yes      | No            |
| [sp_sproc_columns](https://msdn.microsoft.com/library/ms182705.aspx) | Yes      | Yes           |
| [sp_statistics](https://msdn.microsoft.com/library/ms173842.aspx) | Yes      | No            |
| [sp_tables](https://msdn.microsoft.com/library/ms186250.aspx) | Yes      | Yes           |
| [sp_unprepare](https://msdn.microsoft.com/library/ff848735.aspx) | Yes      | No            |



## SET statements

| SET statement                                                | SQL pool | SQL on-demand |
| ------------------------------------------------------------ | -------- | ------------- |
| [SET ANSI_DEFAULTS](https://msdn.microsoft.com/library/ms188340.aspx) | Yes      | Yes           |
| [SET ANSI_NULL_DFLT_OFF](https://msdn.microsoft.com/library/ms187356.aspx) | Yes      | Yes           |
| [SET ANSI_NULL_DFLT_ON](https://msdn.microsoft.com/library/ms187375.aspx) | Yes      | Yes           |
| [SET ANSI_NULLS](https://msdn.microsoft.com/library/ms188048.aspx) | Yes      | Yes           |
| [SET ANSI_PADDING](https://msdn.microsoft.com/library/ms187403.aspx) | Yes      | Yes           |
| [SET ANSI_WARNINGS](https://msdn.microsoft.com/library/ms190368.aspx) | Yes      | Yes           |
| [SET ARITHABORT](https://msdn.microsoft.com/library/ms190306.aspx) | Yes      | Yes           |
| [SET ARITHIGNORE](https://msdn.microsoft.com/library/ms184341.aspx) | Yes      | Yes           |
| [SET CONCAT_NULL_YIELDS_NULL](https://msdn.microsoft.com/library/ms176056.aspx) | Yes      | Yes           |
| [SET DATEFIRST](https://msdn.microsoft.com/library/ms181598.aspx) | Yes      | Yes           |
| [SET DATEFORMAT](https://msdn.microsoft.com/library/ms189491.aspx) | Yes      | Yes           |
| [SET FMTONLY](https://msdn.microsoft.com/library/ms173839.aspx) | Yes      | Yes           |
| [SET IMPLICIT_TRANSACITONS](https://msdn.microsoft.com/library/ms187807.aspx) | Yes      | No            |
| [SET LOCK_TIMEOUT](https://msdn.microsoft.com/library/ms189470.aspx) | Yes      | Yes           |
| [SET NUMBERIC_ROUNDABORT](https://msdn.microsoft.com/library/ms188791.aspx) | Yes      | Yes           |
| [SET QUOTED_IDENTIFIER](https://msdn.microsoft.com/library/ms174393.aspx) | Yes      | Yes           |
| [SET ROWCOUNT](https://msdn.microsoft.com/library/ms188774.aspx) | Yes      | Yes           |
| [SET TEXTSIZE](https://msdn.microsoft.com/library/ms186238.aspx) | Yes      | Yes           |
| [SET TRANSACTION ISOLATION LEVEL](https://msdn.microsoft.com/library/ms173763.aspx) | Yes      | Yes           |
| [SET XACT_ABORT](https://msdn.microsoft.com/library/ms188792.aspx) | Yes      | No            |



## Next steps
For more reference information, see [T-SQL statements in SQL Analytics](sql-data-warehouse-reference-tsql-statements.md), and [System views in SQL Analytics](sql-data-warehouse-reference-tsql-system-views.md).

