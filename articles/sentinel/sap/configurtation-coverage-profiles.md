### Selecting which logs to enable
 
The following are typical customer configuration profiles for SAP log ingestion. Notably Microsoft is updating the below profiles from times to times.
 
1.	Recommended (default) – This profile includes complete coverage for the built-in analytics, the SAP user authorization master data tables with users and privileges information as well as the capability of tracking changes and activities on the SAP landscape. This mode provides additional logging to allow for post-breach investigations and extended hunting abilities.
2.	Detection focused -  this profile includes the core security logs of the SAP landscape required for the majority of the analytic rules to perform well. Post-breach investigations and hunting capabilities are linited.
 
3.	Minimal – The SAP Security Audit Log is the most important source of data the Microsoft Sentinel Solution for SAP uses to analyze activities on the SAP landscape. Enabling this log is the minimal requirement to provide any security coverage.  
The above configuration profiles can be achived by setting the relevant logs using the systemconfig.ini file file.
