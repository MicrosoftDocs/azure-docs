var batch = require('azure-batch');
var https = require('https');
//var sleep = require('thread-sleep');
var fs = require('fs');

var accountName = 'gecqrsgbtch';

var accountKey = 'JF5eLlEMWjMkLiI6QGWVMiasOsGU4Tc0YNltu//Dy9sgPl0uos7/OUc44YAuaB9b8I6E5gBqWvlC22opTfrgrg==';

var credentials = new batch.SharedKeyCredentials(accountName,accountKey);

var batch_client = new batch.ServiceClient(credentials,'https://gecqrsgbtch.westus.batch.azure.com');

var poolid = "testpoolsg10";
var imgRef = {publisher:"Canonical","offer":"UbuntuServer",sku:"14.04.2-LTS",version:"latest"}
var vmconfig = {imageReference:imgRef,nodeAgentSKUId:"batch.node.ubuntu 14.04"}
var memberlist = null
/*
var file = fs.createWriteStream("memberslist.json");
var request = https.get('https://gecqrhbase.blob.core.windows.net/metafiles/memberslist.json?st=2017-01-07T07%3A22%3A00Z&se=2017-01-08T07%3A22%3A00Z&sp=rl&sv=2015-12-11&sr=b&sig=lug0XpTlwtrw200QirAJkr%2B6dbjoeP88e8hoNLgvw5o%3D',function(response){
    //console.log(response.statusCode);
  response.on('data', function(d) {
	  file.write(d);
      
  });
});
request.end();

var contents = fs.readFileSync("memberslist.json");
*/

/// TODO: Download the memberlist jsons
/*
var memberslist = [{"id": "201612",
	"storage_acc_name": "gecqrhbase",
	"storage_acc_key": "2V/2YE0CwGYsb9YdqCKSBdNyZel0BFo8ommVZQiocfCcDw/iqotPAPx93N0wLM8TZZ2sqQZJjyT4+fDXK25Bng==",
	"root_path_raw": "incremental",
	"root_path_mapped":"",	
	"isfirstload":true,
	"firstloaddate":{"year":"2016","month":"12","day":"11","hour":"00"},
    "incrementalLoaddates":[{"year":"2016","month":"12","day":"12","hour":"00"},{"year":"2016","month":"12","day":"13","hour":"00"},{"year":"2016","month":"12","day":"14","hour":"00"}],
	"pool_num_vms":4,
	"pool_vm_size":"F2",
	"folders":["ALLERGY","Appointments","APPTSLOT","APPTYPE","CarePlan","CQM_Map","DIRECTIV","DataCount","DIRECTIVE","DOCCONTB","DoctorFacility","DOCUMENT","DOCVIEWS_TRACKER","EXT_CODE","FamilyHealthHistory","Immunization","InsuranceCarriers","Language","LOCREG","MasterDiagnosis","MedAdministration","MedAdminRequest","MEDICATE","MUActivityLog","OBS","OBSHEAD","ORDDX","ORDERS","PatientInsurance","PatientProfile","PatientRace","PATIENTVISIT","PRESCRIB","PROBLEM","REL_OBS_EXT_CODE","TimesonceOffset","USR"]
}]
*/

var memberslist = [{"id": "201612",
	"storage_acc_name": "gecqrhbase",
	"storage_acc_key": "2V/2YE0CwGYsb9YdqCKSBdNyZel0BFo8ommVZQiocfCcDw/iqotPAPx93N0wLM8TZZ2sqQZJjyT4+fDXK25Bng==",
	"root_path_raw": "incremental",
	"root_path_mapped":"",	
	"isfirstload":true,
	"firstloaddate":{"year":"2016","month":"12","day":"11","hour":"00"},
    "incrementalLoaddates":[{"year":"2016","month":"12","day":"12","hour":"00"},{"year":"2016","month":"12","day":"13","hour":"00"},{"year":"2016","month":"12","day":"14","hour":"00"}],
	"pool_num_vms":4,
	"pool_vm_size":"STANDARD_F4",
    
	"folders":["DIRECTIV","DOCCONTB"]
}]

// "folders":["ALLERGY","DOCUMENT",]
for(var i=0;i< memberslist.length;i++)
{
    if(memberslist[i].isfirstload)
    {
        var memberid = memberslist[i].id;
        var storage_acc_key = memberslist[i].storage_acc_key;
        var storage_acc_name = memberslist[i].storage_acc_name;
        var folders = memberslist[i].folders;
        var numVms = folders.length;
        var vmSize = memberslist[i].pool_vm_size;
        var firstloaddate = memberslist[i].firstloaddate;
        var poolid = "fl" + "_" + memberid;
        /// if first time: then create a pool (one node per folder) , one job (storedata),for each folder one task; get the year, month,day
        var poolConfig = {id:poolid, displayName:poolid,vmSize:vmSize,virtualMachineConfiguration:vmconfig,targetDedicated:numVms,enableAutoScale:false }

        var pool = batch_client.pool.add(poolConfig,function(error,result){
            console.log(result);
            console.log(error);

        });


        /// Ideally check for status
        var waitTill = new Date(new Date().getTime() + 300 * 1000);
        while(waitTill > new Date()){}

        var job_prep_task_config = {id:"storedatahbasesg",commandLine:"sudo sh startup_prereq.sh > startup.log",resourceFiles:[{'blobSource':'https://gecqrhbase.blob.core.windows.net/metafiles/startup_prereq.sh?st=2017-01-07T07%3A22%3A00Z&se=2017-08-08T07%3A22%3A00Z&sp=rl&sv=2015-12-11&sr=b&sig=zczB5Vlgz6ZE6UWtM6%2BAPuOceneQfBA2Z9icIgcjPwQ%3D','filePath':'startup_prereq.sh'}],waitForSuccess:true,runElevated:true}
        var pool_config = {poolId:poolid}
        var job_config = {id:poolid,displayName:"storing data in",jobPreparationTask:job_prep_task_config,poolInfo:pool_config}

        var job = batch_client.job.add(job_config,function(error,result){
        console.log(error);
        console.log(result);
        });        
 

        /// Ideally check for status
       // setTimeout(function(){console.log("waiting for the pools to be available")},3000000*20);
        var waitTill = new Date(new Date().getTime() + 300 * 1000);
        while(waitTill > new Date()){}

      for(var f=0;f<folders.length;f++)
        {
            var fString = '["' + folders[f] + '"]';
            
            var date_param = Math.floor((new Date()).getUTCMilliseconds() / 1000)
            var exec_info_config = {startTime: date_param}

            var task_config = {id:memberid+"_"+folders[f] + 'csvjson','displayName':'convert csvs to json for ' + folders[0],commandLine:'python processcsv.py --year ' + firstloaddate.year + ' --month ' + firstloaddate.month +' --day ' + firstloaddate.day + ' --hour '+ firstloaddate.hour + ' --memberObj \'[{"id":"' + memberid +'","storage_acc_name":"' + memberslist[0].storage_acc_name +'","storage_acc_key": "' + memberslist[0].storage_acc_key +'","root_path": "incremental","folders":' + fString +'}]\'',resourceFiles:[{'blobSource':'https://gecqrhbase.blob.core.windows.net/metafiles/processcsv.py?st=2017-01-07T07%3A22%3A00Z&se=2017-08-08T07%3A22%3A00Z&sp=rl&sv=2015-12-11&sr=b&sig=iJ%2BUv%2FPO%2FppG4nxGQ1H%2BuSMlI7MlwQ%2B5Nye4eqIBioE%3D','filePath':'processcsv.py'}]}
            var task = batch_client.task.add(poolid,task_config,function(error,result){
                console.log(error);
                console.log(result);

            });            
        }        

   // setTimeout(function(){console.log("waiting for the tasks to be created...")},3000000*20);
var waitTill = new Date(new Date().getTime() + 300 * 1000);
        while(waitTill > new Date()){}

     for(var f=0;f<folders.length;f++)
        {
            var fString = '["' + folders[f] + '"]';
            console.log(fString);
            var date_param = Math.floor((new Date()).getUTCMilliseconds() / 1000)
            var exec_info_config = {startTime: date_param}

            var task_config = {id:memberid+"_"+folders[f] + 'storejson','displayName':'store json hbase ' + folders[0],commandLine:'python hbasestore.py --year ' + firstloaddate.year + ' --month ' + firstloaddate.month +' --day ' + firstloaddate.day + ' --hour '+ firstloaddate.hour + ' --memberObj \'[{"id":"' + memberid +'","storage_acc_name":"' + memberslist[0].storage_acc_name +'","storage_acc_key": "' + memberslist[0].storage_acc_key +'","root_path": "incremental","folders":' + fString +'}]\'',resourceFiles:[{'blobSource':'https://gecqrhbase.blob.core.windows.net/metafiles/hbasestore.py?st=2017-01-09T06%3A43%3A00Z&se=2017-01-23T06%3A43%3A00Z&sp=rl&sv=2015-12-11&sr=b&sig=M7hqQA4aSOgLCjkDMHrlwydNmENSTYoTc2egxfSx8ZE%3D','filePath':'hbasestore.py'}]}
            var task = batch_client.task.add(poolid,task_config,function(error,result){
                console.log(error);
                console.log(result);

            });            
        }        

        //memberslist[]
    }
    else
    {


        var memberid = memberslist[i].id;
        var storage_acc_key = memberslist[i].storage_acc_key;
        var storage_acc_name = memberslist[i].storage_acc_name;
        var folders = memberslist[i].folders;
        var numVms = memberslist.length;
        var vmSize = memberslist[i].pool_vm_size;
        var firstloaddate = memberslist[i].firstloaddate;
        var incrementalLoaddates = memberslist[i].incrementalLoaddates;
        var poolid = "fl" + "_" + memberid + "inc";
        /// if first time: then create a pool (one node per folder) , one job (storedata),for each folder one task; get the year, month,day
        var poolConfig = {id:poolid, displayName:poolid,vmSize:vmSize,virtualMachineConfiguration:vmconfig,targetDedicated:numVms,enableAutoScale:false }

        var pool = batch_client.pool.add(poolConfig,function(error,result){
            console.log(result);
            console.log(error);

        });
      

        var fString = '[' 
        var isFirstTime = true;
        for(var f=0;f<folders.length;f++)
        {   
            if(isFirstTime)
            {
                fString = fString + '"' + folders[f] + '"';
                isFirstTime = false;
            }
            else
            {
                fString = ',"' + folders[f] + '"';
            }

            
        }
        fString = fString + '"]';
         console.log(fString);

        /// Ideally check for status
        //setTimeout(function(){console.log("waiting for the pools to be available")},300000*20);
        var waitTill = new Date(new Date().getTime() + 300 * 1000);
        while(waitTill > new Date()){}

        var job_prep_task_config = {id:"storedatahbasesg_inc",commandLine:"sudo sh startup_prereq.sh > startup.log",resourceFiles:[{'blobSource':'https://gecqrhbase.blob.core.windows.net/metafiles/startup_prereq.sh?st=2017-01-07T07%3A22%3A00Z&se=2017-08-08T07%3A22%3A00Z&sp=rl&sv=2015-12-11&sr=b&sig=zczB5Vlgz6ZE6UWtM6%2BAPuOceneQfBA2Z9icIgcjPwQ%3D','filePath':'startup_prereq.sh'}],waitForSuccess:true,runElevated:true}
        var pool_config = {poolId:poolid}
        var job_config = {id:poolid,displayName:"storing data in",jobPreparationTask:job_prep_task_config,poolInfo:pool_config}

        var job = batch_client.job.add(job_config,function(error,result){
        console.log(error);
        console.log(result);
        });        


        /// Ideally check for status

        
            //var fString = '["' + folders[f] + '"]';
            
            var date_param = Math.floor((new Date()).getUTCMilliseconds() / 1000)
            var exec_info_config = {startTime: date_param}
            for(var d=0;d<incrementalLoaddates.length;d++)
            {
                  var task_config = {id:memberid+"_"+ incrementalLoaddates[d].year+ incrementalLoaddates[d].month+incrementalLoaddates[d].day+incrementalLoaddates[d].month+incrementalLoaddates[d].hour+ 'csvjson_inc','displayName':'convert csvs to json for ' + folders[0],commandLine:'python processcsv.py --year ' + incrementalLoaddates[d].year + ' --month ' + incrementalLoaddates[d].month +' --day ' + incrementalLoaddates[d].day + ' --hour '+ incrementalLoaddates[d].hour + ' --memberObj \'[{"id":"' + memberid +'","storage_acc_name":"' + memberslist[0].storage_acc_name +'","storage_acc_key": "' + memberslist[0].storage_acc_key +'","root_path": "incremental","folders":' + fString +'}]\'',resourceFiles:[{'blobSource':'https://gecqrhbase.blob.core.windows.net/metafiles/processcsv.py?st=2017-01-07T07%3A22%3A00Z&se=2017-08-08T07%3A22%3A00Z&sp=rl&sv=2015-12-11&sr=b&sig=iJ%2BUv%2FPO%2FppG4nxGQ1H%2BuSMlI7MlwQ%2B5Nye4eqIBioE%3D','filePath':'processcsv.py'}]}
                  var task = batch_client.task.add(poolid,task_config,function(error,result){
                console.log(error);
                console.log(result);

            });  
            }

                        
                
    //setTimeout(function(){console.log("waiting for the tasks to be created")},300000*20);
        var waitTill = new Date(new Date().getTime() + 300 * 1000);
        while(waitTill > new Date()){}
//setTimeout(function(){console.log("waiting for the tasks to be created...")},1000);

        for(var f=0;f<folders.length;f++)
        {
           // var fString = '["' + folders[f] + '"]';
           
            var date_param = Math.floor((new Date()).getUTCMilliseconds() / 1000)
            var exec_info_config = {startTime: date_param}

            var task_config = {id:memberid+"_"+folders[f] + 'storejson','displayName':'store json hbase ' + folders[0],commandLine:'python hbasestore.py --year ' + firstloaddate.year + ' --month ' + firstloaddate.month +' --day ' + firstloaddate.day + ' --hour '+ firstloaddate.hour + ' --memberObj \'[{"id":"' + memberid +'","storage_acc_name":"' + memberslist[0].storage_acc_name +'","storage_acc_key": "' + memberslist[0].storage_acc_key +'","root_path": "incremental","folders":' + fString +'}]\'',resourceFiles:[{'blobSource':'https://gecqrhbase.blob.core.windows.net/metafiles/hbasestore.py?st=2017-01-09T06%3A43%3A00Z&se=2017-01-23T06%3A43%3A00Z&sp=rl&sv=2015-12-11&sr=b&sig=M7hqQA4aSOgLCjkDMHrlwydNmENSTYoTc2egxfSx8ZE%3D','filePath':'hbasestore.py'}]}
            var task = batch_client.task.add(poolid,task_config,function(error,result){
                console.log(error);
                console.log(result);

            });            
        }        

        
















    }

    //console.log(memberslist[i].id);

}



/// For each member, following are the steps:
/// check if it is first time or incremental
//// 

///  Monitor tasks running , after all done set the members list to incremental
/// if incremental:
///  create one  pool, with number of nodes = number of members
/// for each member :
/// get the list of folder dates (years, month, day); 
///  for each date, create a task with list of all folders per member
///  Monitor all tasks





/*
//var start_task = {commandLine:"install_prereq.sh",runElevated:true,waitForSuccess:true}


var poolConfig = {id:poolid, displayName:poolid,vmSize:"STANDARD_A2",virtualMachineConfiguration:vmconfig,targetDedicated:5,enableAutoScale:false }

var pool = batch_client.pool.add(poolConfig,function(error,result){
    console.log(result);
    console.log(error);

});



var job_prep_task_config = {id:"prepjobsg",commandLine:"sudo sh startup_prereq.sh > startup.log",resourceFiles:[{'blobSource':'https://gecqrhbase.blob.core.windows.net/metafiles/startup_prereq.sh?st=2017-01-05T07%3A48%3A00Z&se=2017-01-06T07%3A48%3A00Z&sp=rl&sv=2015-12-11&sr=b&sig=aKrEt4GI58B1luLcBLBjvod3Eo7jzFK6MBg0IZSIZTs%3D','filePath':'startup_prereq.sh'}],waitForSuccess:true,runElevated:true}
var pool_config = {poolId:poolid}
var job_config = {id:"testpoolsg10",displayName:"test job name",jobPreparationTask:job_prep_task_config,poolInfo:pool_config}

var job = batch_client.job.add(job_config,function(error,result){
    console.log(error);
    console.log(result);
}); 


var date_param = Math.floor((new Date()).getUTCMilliseconds() / 1000)


var exec_info_config = {startTime: date_param}

var task_config = {id:'processcsv05','displayName':'convert csvs to jsons',commandLine:'python processcsv.py --year 2016 --month 11 --day 14 --memberObj \'[{"id":"400002","storage_acc_name":"gecqrhbase","storage_acc_key": "2V/2YE0CwGYsb9YdqCKSBdNyZel0BFo8ommVZQiocfCcDw/iqotPAPx93N0wLM8TZZ2sqQZJjyT4+fDXK25Bng==","root_path": "incremental","root_path_mapped":"","isfirstload":true,"pool_num_vms":4,"pool_vm_size":"STANDARD_A2","folders":["ALLERGY","Appointments","CarePlan","CQM_Map","DIRECTIV","DOCCONTB","DoctorFacility","DOCUMENT","DOCVIEWS_TRACKER","EXT_CODE","FamilyHealthHistory","Immunization","InsuranceCarriers","Language","LOCREG","MasterDiagnosis","MedAdministration","MedAdminRequest","MEDICATE","MUActivityLog","OBS","OBSHEAD","ORDDX","ORDERS","PatientInsurance","PatientProfile","PatientRace","PRESCRIB","PROBLEM","REL_OBS_EXT_CODE","TimesonceOffset","USR"]}]\'',resourceFiles:[{'blobSource':'https://gecqrhbase.blob.core.windows.net/metafiles/processcsv.py?st=2017-01-05T07%3A48%3A00Z&se=2017-01-06T07%3A48%3A00Z&sp=rl&sv=2015-12-11&sr=b&sig=p9v5CLMZ7BTKugNppKkKLnuRZJsAivKetmkfDfnpSwY%3D','filePath':'processcsv.py'}],executionInfo:exec_info_config}
var tak = batch_client.task.add("testpoolsg10",task_config,function(error,result){
    console.log(error);
    console.log(result);

}); 

*/