# Data Preparation User Guide #

## Introduction ##


## Understanding how it all works ##
### Step Execution, History and Caching ###
Data Prep step history maintains a series of caches for perf reasons. If you click on a step and it hits a cache it does not re-execute. If you have a write block at the end of the step history and you flip back and forth on the steps but make no changes then the write will not be triggered after the first time. If you 
- Make changes to the write block or
- Add a new transform block and move it above the write block generating a cache invalidation or
- If you change the properties of a block above the write block generating a cache invalidation or
- Select refresh on a sample(thus invalidating all the cache’s)

Then a new write will occur overwriting the previous one.


### List of Appendices ###
[Appendix 1 - Supported Platforms](DataPrepAppendix/DataPrep_Appendix1_SupportedPlatforms.md)  
[Appendix 2 - Supported Data Sources](DataPrepAppendix/DataPrep_Appendix2_SupportedDataSources.md)  
[Appendix 3 - Supported Transforms](DataPrepAppendix/DataPrep_Appendix3_SupportedTransforms.md)  
[Appendix 4 - Supported Inspectors](DataPrepAppendix/DataPrep_Appendix4_SupportedInspectors.md)  
[Appendix 5 - Supported Destinations](DataPrepAppendix/DataPrep_Appendix5_SupportedDestinations.md)  
[Appendix 6 - Sample Filter Expressions in Python](DataPrepAppendix/DataPrep_Appendix6_SampleFilterExpressions_Python.md)  
[Appendix 7 - Sample Transform Dataflow Expressions in Python](DataPrepAppendix/DataPrep_Appendix7_SampleTransformDataFlow_Python.md)  
[Appendix 8 - Sample Data Sources in Python](DataPrepAppendix/DataPrep_Appendix8_SampleSourceConnections_Python.md)  
[Appendix 9 - Sample Destination Connections in Python](DataPrepAppendix/DataPrep_Appendix9_SampleDestinationConnections_Python.md)  
[Appendix 10 - Sample Column Transforms in Python](DataPrepAppendix/DataPrep_Appendix10_SampleCustomColumnTransforms_Python.md)  


