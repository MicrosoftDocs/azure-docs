## Undestanding the Dynamic Hosting Plan

When creating functions apps you can select to run them on a Dynamic Hosting Plan (new!) or a regular App Service Plan. 
In the App Service Plan, your functions will run on a dedicated VM, just like web apps work today (for Basic, Standard or Premium SKUs). 
This dedicated VM is allocated to your apps and/or functions and is available regardless of any code being actively executed. 

In the Dynamic plan, your function apps will be assigned to a function app instance. If needed more instances will be added dynamically.
Those instances can span across multilpe computing resources, making the most out of the Azure infrastructure. 
Your functions will run parallely minimizing the total time needed to process requests. 
Each function execution time is added up, in seconds, and aggregated by the containing function app.    
   
### Memory Tier

Depending on your function needs you can select the amount of memory required to run them in the Function App (container of functions).
The memory size options vary from 128MB to 1536MB. 
The selected memory size corresponds to the Working Set needed by all the functions that are part of your function app. 
If your code requires more memory than the selected size, the function app instance will be shut down due to lack of available memory.

### Scaling

The Azure Functions platform will evaluate the traffic needs, based on the configured triggers, to decide when to scale up or down. 
The granularity of scaling is the function app. Scaling up in this case means adding more instances of a function app. 
Inversily as traffic goes down, function app instances are disabled. 

### Resource Consumption

In the Dynamic mode resource allocation is done differently than the standard App Service plan, therefore the consumption model is also different, allowing for a "pay-per-use" model. 
Consumption will be reported per function app, only for time when code is being executed.  
It is computed by multiplying the memory size (in GB) by the total amount of execution time (in seconds) for all functions running inside that function app. 
The unit of consumption will be GB-s (Gigabytes by Seconds).    
