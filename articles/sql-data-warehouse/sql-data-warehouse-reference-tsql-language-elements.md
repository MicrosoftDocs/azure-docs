<properties
   pageTitle="SQL Data Warehouse Transact-SQL language elements | Microsoft Azure"
   description="List of links to reference content for the Transact-SQL language elements used for SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/23/2015"
   ms.author="barbkess"/>

# Language elements

## Core elements

- [syntax conventions](https://msdn.microsoft.com/library/ms177563.aspx)
- object naming rules
- [reserved keywords](https://msdn.microsoft.com/library/ms189822.aspx)
- [collations](https://msdn.microsoft.com/library/ff848763.aspx)
- [comments](https://msdn.microsoft.com/library/ms181627.aspx)
- [constants](https://msdn.microsoft.com/library/ms179899.aspx)
- [data types](https://msdn.microsoft.com/library/ms187752.aspx)
- [EXECUTE](https://msdn.microsoft.com/library/ms188332.aspx)
- [expressions](https://msdn.microsoft.com/library/ms190286.aspx)
- [KILL](https://msdn.microsoft.com/library/ms173730.aspx)
- [IDENTITY property workaround](https://msdn.microsoft.com/library/ms186775.aspx)
- [PRINT](https://msdn.microsoft.com/library/ms176047.aspx)
- [USE](https://msdn.microsoft.com/library/ms188366.aspx)

## Batches, control-of-flow, and variables

- [BEGIN...END](https://msdn.microsoft.com/library/ms190487.aspx)
- [BREAK](https://msdn.microsoft.com/library/ms181271.aspx)
- DECLARE
- [IF...ELSE](https://msdn.microsoft.com/library/ms182717.aspx)
- [RAISERROR](https://msdn.microsoft.com/library/ms178592.aspx)
- [SET@local_variable](https://msdn.microsoft.com/library/ms189484.aspx)
- [THROW](https://msdn.microsoft.com/library/ee677615.aspx)
- [TRY...CATCH](https://msdn.microsoft.com/library/ms175976.aspx)
- [WHILE](https://msdn.microsoft.com/library/ms178642.aspx)

## Operators
- [+ (Add)](https://msdn.microsoft.com/library/ms178565.aspx)
- [+ (String Concatenation)](https://msdn.microsoft.com/library/ms177561.aspx)
- [- (Negative)](https://msdn.microsoft.com/library/ms189480.aspx)
- [- (Subtract)](https://msdn.microsoft.com/library/ms189518.aspx)
- [* (Multiply)](https://msdn.microsoft.com/library/ms176019.aspx)
- [/ (Divide)](https://msdn.microsoft.com/library/ms175009.aspx)
- [Modulo](https://msdn.microsoft.com/library/ms190279.aspx)

## Wildcard character(s) to match
- [= (Equals)](https://msdn.microsoft.com/library/ms175118.aspx)
- [> (Greater than)](https://msdn.microsoft.com/library/ms178590.aspx)
- [< (Less than)](https://msdn.microsoft.com/library/ms179873.aspx)
- [>= (Great than or equal to)](https://msdn.microsoft.com/library/ms181567.aspx)
- [<= (Less than or equal to)](https://msdn.microsoft.com/library/ms174978.aspx)
- [<> (Not equal to)](https://msdn.microsoft.com/library/ms176020.aspx)
- [!= (Not equal to)](https://msdn.microsoft.com/library/vstudio/bb399278.aspx)
- [AND](https://msdn.microsoft.com/library/ms188372.aspx)
- [BETWEEN](https://msdn.microsoft.com/library/ms187922.aspx)
- [EXISTS](https://msdn.microsoft.com/library/ms188336.aspx)
- [IN](https://msdn.microsoft.com/library/ms177682.aspx)
- [IS [NOT] NULL](https://msdn.microsoft.com/library/ms188795.aspx)
- [LIKE](https://msdn.microsoft.com/library/ms179859.aspx)
- [NOT](https://msdn.microsoft.com/library/ms189455.aspx)
- NULL and UNKNOWN
- [OR](https://msdn.microsoft.com/library/ms188361.aspx)

### Bitwise operators

- [& (Bitwise AND)](https://msdn.microsoft.com/library/ms174965.aspx)
- [| (Bitwise OR)](https://msdn.microsoft.com/library/ms186714.aspx)
- [^ (Bitwise exclusive OR)](https://msdn.microsoft.com/library/ms190277.aspx)
- [~ (Bitwise NOT)](https://msdn.microsoft.com/library/ms173468.aspx)
- [^= (Bitwise Exclusive OR EQUALS)](https://msdn.microsoft.com/library/cc627413.aspx)
- |= (Bitwise OR EQUALS)
- ? (Bitwise AND EQUALS)

## Functions

- [@@DATEFIRST](https://msdn.microsoft.com/library/ms187766.aspx)
- [@@ERROR](https://msdn.microsoft.com/library/ms188790.aspx)
- [@@LANGUAGE](https://msdn.microsoft.com/library/ms177557.aspx)
- [@@SPID](https://msdn.microsoft.com/library/ms189535.aspx)
- [@@TRANCOUNT](https://msdn.microsoft.com/library/ms187967.aspx)
- [@@VERSION](https://msdn.microsoft.com/library/ms177512.aspx)
- [ABS](https://msdn.microsoft.com/library/ms189800.aspx)
- [ACOS](https://msdn.microsoft.com/library/ms178627.aspx)
- [ASCII](https://msdn.microsoft.com/library/ms177545.aspx)
- [ASIN](https://msdn.microsoft.com/library/ms181581.aspx)
- [ATAN](https://msdn.microsoft.com/library/ms181746.aspx)
- [ATN2](https://msdn.microsoft.com/library/ms173854.aspx)
- [CASE](https://msdn.microsoft.com/library/ms181765.aspx)
- [CAST and CONVERT](https://msdn.microsoft.com/library/ms187928.aspx)
- [CEILING](https://msdn.microsoft.com/library/ms189818.aspx)
- [CHAR](https://msdn.microsoft.com/library/ms187323.aspx)
- [CHARINDEX](https://msdn.microsoft.com/library/ms186323.aspx)
- [COALESCE](https://msdn.microsoft.com/library/ms190349.aspx)
- [COL_NAME](https://msdn.microsoft.com/library/ms174974.aspx)
- [COLLATIONPROPERTY](https://msdn.microsoft.com/library/ms190305.aspx)
- [CONCAT](https://msdn.microsoft.com/library/hh231515.aspx)
- [COS](https://msdn.microsoft.com/library/ms188919.aspx)
- [COT](https://msdn.microsoft.com/library/ms188921.aspx)
- [COUNT](https://msdn.microsoft.com/library/ms175997.aspx)
- [COUNT_BIG](https://msdn.microsoft.com/library/ms190317.aspx)
- [CURRENT_TIMESTAMP](https://msdn.microsoft.com/library/ms188751.aspx)
- [CURRENT_USER](https://msdn.microsoft.com/library/ms176050.aspx)
- [DATABASEPROPERTYEX](https://msdn.microsoft.com/library/ms186823.aspx)
- [DATALENGTH](https://msdn.microsoft.com/library/ms173486.aspx)
- [DATEADD](https://msdn.microsoft.com/library/ms186819.aspx)
- [DATEDIFF](https://msdn.microsoft.com/library/ms189794.aspx)
- [DATEFROMPARTS](https://msdn.microsoft.com/library/hh213228.aspx)
- [DATENAME](https://msdn.microsoft.com/library/ms174395.aspx)
- [DATEPART](https://msdn.microsoft.com/library/ms174420.aspx)
- [DATETIME2FROmPARTS](https://msdn.microsoft.com/library/hh213312.aspx)
- [DATETIMEFROMPARTS](https://msdn.microsoft.com/library/hh213233.aspx)
- [DATETIMEOFFSETFROMPARTS](https://msdn.microsoft.com/library/hh231077.aspx)
- [DAY](https://msdn.microsoft.com/library/ms176052.aspx)
- [DB_ID](https://msdn.microsoft.com/library/ms186274.aspx)
- [DB_NAME](https://msdn.microsoft.com/library/ms189753.aspx)
- [DEGREES](https://msdn.microsoft.com/library/ms178566.aspx)
- [DENSE_RANK](https://msdn.microsoft.com/library/ms173825.aspx)
- [DIFFERENCE](https://msdn.microsoft.com/library/ms188753.aspx)
- [EOMONTH](https://msdn.microsoft.com/library/hh213020.aspx)
- [ERROR_MESSAGE](https://msdn.microsoft.com/library/ms190358.aspx)
- [ERROR_NUMBER](https://msdn.microsoft.com/library/ms175069.aspx)
- [ERROR_PROCEDURE](https://msdn.microsoft.com/library/ms188398.aspx)
- [ERROR_SEVERITY](https://msdn.microsoft.com/library/ms178567.aspx)
- [ERROR_STATE](https://msdn.microsoft.com/library/ms180031.aspx)
- [EXP](https://msdn.microsoft.com/library/ms179857.aspx)
- [FLOOR](https://msdn.microsoft.com/library/ms178531.aspx)
- [GETDATE](https://msdn.microsoft.com/library/ms188383.aspx)
- [GETUTCDATE](https://msdn.microsoft.com/library/ms178635.aspx)
- [HAS_DBACCESS](https://msdn.microsoft.com/library/ms187718.aspx)
- [HASHBYTES](https://msdn.microsoft.com/library/ms174415.aspx)
- [INDEXPROPERTY](https://msdn.microsoft.com/library/ms187729.aspx)
- [ISDATE](https://msdn.microsoft.com/library/ms187347.aspx)
- [ISNULL](https://msdn.microsoft.com/library/ms184325.aspx)
- [ISNUMERIC](https://msdn.microsoft.com/library/ms186272.aspx)
- [LAG](https://msdn.microsoft.com/library/hh231256.aspx)
- [LEAD](https://msdn.microsoft.com/library/hh213125.aspx)
- [LEFT](https://msdn.microsoft.com/library/ms177601.aspx)
- [LEN](https://msdn.microsoft.com/library/ms190329.aspx)
- [LOG](https://msdn.microsoft.com/library/ms190319.aspx)
- [LOG10](https://msdn.microsoft.com/library/ms175121.aspx)
- [LOWER](https://msdn.microsoft.com/library/ms174400.aspx)
- [LTRIM](https://msdn.microsoft.com/library/ms177827.aspx)
- [MAX](https://msdn.microsoft.com/library/ms187751.aspx)
- [MIN](https://msdn.microsoft.com/library/ms179916.aspx)
- [MONTH](https://msdn.microsoft.com/library/ms187813.aspx)
- [NCHAR](https://msdn.microsoft.com/library/ms182673.aspx)
- [NTILE](https://msdn.microsoft.com/library/ms175126.aspx)
- [NULLIF](https://msdn.microsoft.com/library/ms177562.aspx)
- [OBJECT_ID](https://msdn.microsoft.com/library/ms190328.aspx)
- [OBJECT_NAME](https://msdn.microsoft.com/library/ms186301.aspx)
- [OBJECTPROPERTY](https://msdn.microsoft.com/library/ms176105.aspx)
- [OIBJECTPROPERTYEX](https://msdn.microsoft.com/library/ms188390.aspx)
- [ODBCS scalar functions](https://msdn.microsoft.com/library/bb630290.aspx)
- [OVER clause](https://msdn.microsoft.com/library/ms189461.aspx)
- [PARSENAME](https://msdn.microsoft.com/library/ms188006.aspx)
- [PATINDEX](https://msdn.microsoft.com/library/ms188395.aspx)
- [PERCENTILE_CONT](https://msdn.microsoft.com/library/hh231473.aspx)
- [PERCENTILE_DISC](https://msdn.microsoft.com/library/hh231327.aspx)
- [PI](https://msdn.microsoft.com/library/ms189512.aspx)
- [POWER](https://msdn.microsoft.com/library/ms174276.aspx)
- [QUOTENAME](https://msdn.microsoft.com/library/ms176114.aspx)
- [RADIANS](https://msdn.microsoft.com/library/ms189742.aspx)
- VRANK
- [REPLACE](https://msdn.microsoft.com/library/ms186862.aspx)
- [REPLICATE](https://msdn.microsoft.com/library/ms174383.aspx)
- [REVERSE](https://msdn.microsoft.com/library/ms180040.aspx)
- [RIGHT](https://msdn.microsoft.com/library/ms177532.aspx)
- [ROUND](https://msdn.microsoft.com/library/ms175003.aspx)
- [ROW_NUMBER](https://msdn.microsoft.com/library/ms186734.aspx)
- [RTRIM](https://msdn.microsoft.com/library/ms178660.aspx)
- [SCHEMA_ID](https://msdn.microsoft.com/library/ms188797.aspx)
- [SCHEMA_NAME](https://msdn.microsoft.com/library/ms175068.aspx)
- [SERVERPROPERTY](https://msdn.microsoft.com/library/ms174396.aspx)
- SESSION_ID
- SESSION_USER
- [SIGN](https://msdn.microsoft.com/library/ms188420.aspx)
- [SIN](https://msdn.microsoft.com/library/ms188377.aspx)
- [SMALLDATETIMEFROMPARTS](https://msdn.microsoft.com/library/hh213396.aspx)
- [SOUNDEX](https://msdn.microsoft.com/library/ms187384.aspx)
- [SPACE](https://msdn.microsoft.com/library/ms187950.aspx)
- [SQL_VARIANT_PROPERTY](https://msdn.microsoft.com/library/ms178550.aspx)
- [SQRT](https://msdn.microsoft.com/library/ms176108.aspx)
- [SQUARE](https://msdn.microsoft.com/library/ms173569.aspx)
- [STATS_DATE](https://msdn.microsoft.com/library/ms190330.aspx)
- [STDEV](https://msdn.microsoft.com/library/ms190474.aspx)
- [STDEVP](https://msdn.microsoft.com/library/ms176080.aspx)
- [STR](https://msdn.microsoft.com/library/ms189527.aspx)
- [STUFF](https://msdn.microsoft.com/library/ms188043.aspx)
- [SUBSTRING](https://msdn.microsoft.com/library/ms187748.aspx)
- [SUM](https://msdn.microsoft.com/library/ms187810.aspx)
- [SUSER_SNAME](https://msdn.microsoft.com/library/ms174427.aspx)
- [SWITCHOFFSET](https://msdn.microsoft.com/library/bb677244.aspx)
- [SYSDATETIME](https://msdn.microsoft.com/library/bb630353.aspx)
- [SYSDATETIMEOFFSET](https://msdn.microsoft.com/library/bb677334.aspx)
- [SYSTEM_USER](https://msdn.microsoft.com/library/ms179930.aspx)
- [SYSUTCDATETIME](https://msdn.microsoft.com/library/bb630387.aspx)
- [TAN](https://msdn.microsoft.com/library/ms190338.aspx)
- [TERTIARY_WEIGHTS](https://msdn.microsoft.com/library/ms186881.aspx)
- [TIMEFROMPARTS](https://msdn.microsoft.com/library/hh213398.aspx)
- [TODATETIMEOFFSET](https://msdn.microsoft.com/library/bb630335.aspx)
- [TYPE_ID](https://msdn.microsoft.com/library/ms181628.aspx)
- [TYPE_NAME](https://msdn.microsoft.com/library/ms189750.aspx)
- [TYPEPROPERTY](https://msdn.microsoft.com/library/ms188419.aspx)
- [UNICODE](https://msdn.microsoft.com/library/ms180059.aspx)
- [UPPER](https://msdn.microsoft.com/library/ms180055.aspx)
- [USER](https://msdn.microsoft.com/library/ms186738.aspx)
- [USER_NAME](https://msdn.microsoft.com/library/ms188014.aspx)
- [VAR](https://msdn.microsoft.com/library/ms186290.aspx)
- [VARP](https://msdn.microsoft.com/library/ms188735.aspx)
- VERSION
- [YEAR](https://msdn.microsoft.com/library/ms186313.aspx)
- [XACT_STATE](https://msdn.microsoft.com/library/ms189797.aspx)

## Transactions

- transactions

## Diagnostic sessions

- CREATE DIAGNOSTICS SESSION

## Procedures

- [sp_addrolemember](https://msdn.microsoft.com/library/ms187750.aspx)
- [sp_columns](https://msdn.microsoft.com/library/ms176077.aspx)
- [sp_configure](https://msdn.microsoft.com/library/ms188787.aspx)
- sp_datatype_info_90
- [sp_droprolemember](https://msdn.microsoft.com/library/ms188369.aspx)
- [sp_execute](https://msdn.microsoft.com/library/ff848746.aspx)
- [sp_executesql](https://msdn.microsoft.com/library/ms188001.aspx)
- [sp_fkeys](https://msdn.microsoft.com/library/ms175090.aspx)
- sp_pdw_add_network_credentials
- sp_pdw_database_encryption
- sp_pdw_database_encryption_regenerate_system_keys
- sp_pdw_log_user_data_masking
- sp_pdw_remove_network_credentials
- [sp_pkeys](https://msdn.microsoft.com/library/ms189813.aspx)
- [sp_prepare](https://msdn.microsoft.com/library/ff848808.aspx)
- sp_special_columns_100
- [sp_sproc_columns](https://msdn.microsoft.com/library/ms182705.aspx)
- [sp_statistics](https://msdn.microsoft.com/library/ms173842.aspx)
- [sp_tables](https://msdn.microsoft.com/library/ms186250.aspx)
- [sp_unprepare](https://msdn.microsoft.com/library/ff848735.aspx)



## SET statements

- [SET ANSI_DEFAULTS](https://msdn.microsoft.com/library/ms188340.aspx)
- [SET ANSI_NULL_DFLT_OFF](https://msdn.microsoft.com/library/ms187356.aspx)
- SET ANSI_NULL_DFLOT_ON
- [SET ANSI_NULLS](https://msdn.microsoft.com/library/ms188048.aspx)
- [SET ANSI_PADDING](https://msdn.microsoft.com/library/ms187403.aspx)
- [SET ANSI_WARNINGS](https://msdn.microsoft.com/library/ms190368.aspx)
- [SET ARITHABORT](https://msdn.microsoft.com/library/ms190306.aspx)
- [SET ARITHIGNORE](https://msdn.microsoft.com/library/ms184341.aspx)
- [SET CONCAT_NULL_YIELDS_NULL](https://msdn.microsoft.com/library/ms176056.aspx)
- [SET DATEFIRST](https://msdn.microsoft.com/library/ms181598.aspx)
- [SET DATEFORMAT](https://msdn.microsoft.com/library/ms189491.aspx)
- [SET FMTONLY](https://msdn.microsoft.com/library/ms173839.aspx)
- [SET IMPLICIT_TRANSACITONS](https://msdn.microsoft.com/library/ms187807.aspx)
- [SET LOCK_TIMEOUT](https://msdn.microsoft.com/library/ms189470.aspx)
- [SET NUMBERIC_ROUNDABORT](https://msdn.microsoft.com/library/ms188791.aspx)
- [SET QUOTED_IDENTIFIER](https://msdn.microsoft.com/library/ms174393.aspx)
- [SET ROWCOUNT](https://msdn.microsoft.com/library/ms188774.aspx)
- [SET TEXTSIZE](https://msdn.microsoft.com/library/ms186238.aspx)
- [SET TRANSACTION ISOLATION LEVEL](https://msdn.microsoft.com/library/ms173763.aspx)
- [SET XACT_ABORT](https://msdn.microsoft.com/library/ms188792.aspx)


## Next steps
For more reference information, see [SQL Data Warehouse reference overview][].

<!--Image references-->

<!--Article references-->
[SQL Data Warehouse development overview]: sql-data-warehouse-overview-reference.md

<!--MSDN references-->