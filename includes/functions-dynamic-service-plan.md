## Dynamic Service Plan

In the Dynamic Service Plan, your function apps will be assigned to a function app instance. If needed more instances will be added dynamically.
Those instances can span across multiple computing resources, making the most out of the available Azure infrastructure. Moreover, your functions will run in parallel minimizing the total time needed to process requests. Execution time for each function is added up, in seconds, and aggregated by the containing function app. With cost driven by the number of instances, their memory size, and total execution time as measured in Gigabyte seconds. This is an excellent option if your compute needs are intermittent or your job times tend to be very short as it allows you to only pay for compute resources when they are actually in use.   

### Memory tier

Depending on your function needs you can select the amount of memory required to run them in the Function App (container of functions).
The memory size options vary from **128MB to 1536MB**. 
The selected memory size corresponds to the Working Set needed by all the functions that are part of your function app. 
If your code requires more memory than the selected size, the function app instance will be shut down due to lack of available memory.

### Scaling

The Azure Functions platform will evaluate the traffic needs, based on the configured triggers, to decide when to scale up or down. 
The granularity of scaling is the function app. Scaling up in this case means adding more instances of a function app. Inversely as traffic goes down, function app instances are disabled- eventually scaling down to zero when none are running.  

### Resource consumption and billing

In the Dynamic mode resource allocation is done differently than the standard App Service plan, therefore the consumption model is also different, allowing for a "pay-per-use" model. 
Consumption will be reported per function app, only for time when code is being executed.  
It is computed by multiplying the memory size (in GB) by the total amount of execution time (in seconds) for all functions running inside that function app. 
The unit of consumption will be **GB-s (Gigabyte Seconds)**.