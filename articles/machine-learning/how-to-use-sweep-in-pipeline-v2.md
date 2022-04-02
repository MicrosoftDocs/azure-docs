# How to use sweep(hyperparameter tuning) in pipeline (V2)

In this artilce, you will learn how to do sweep(also known as hyperparameter tuning) in Azure Machine Learning pipeline.

## Prereadings
1. Understand what is sweep, and how to do sweep in Azure Machine Learning start form a single step job. **[to-do](link to single step sweep doc)** It's highly suggest to run the single step sweep example to understand how sweep works in Azure Machine Learning, before using sweep in pipeline. 
2. Understand the benefit of Azure Machine Learning pipeline. [to-do](link to pipeline value prop article.) 

## How to use sweep in Azure Machine Learning pipeline
This sections explains how to use sweep in Azure Machine Learning piepline using CLI, Python SDK and UI. All the three approaches share the same prerequest: you already have a command component created and the command component takes sweepable paremeters as inputs. If you don't have a command component yet. Please follow [this article](link to Blanca's article) to create a command component first. 

### CLI 

Assume you already have a command component defined in YAML. And the command component takes sweepable parameter as inputs.To enable sweep, you just need to add a sweep section in your pipeline defination YAML, which defines the sweep search space, algorithms, objective etc. There is no need to make change to your command component YAML defination. 

**[to-do] add link to command component with input parameter sample or doc.**


A two step pipeline YAML that enables sweep looks like this:

**[to-do] update the YAML, make sure it works. and discuss with dev whether to put it into azureml-example**


```YAML
type: pipeline
settings:
	compute:
	datastore:
jobs:
	sweep_tain:
		type: command
		component: azureml:component:minist_train:0.0.1
		inputs:
			data_folder: ./train_data
		
		sweep:
			algorithm: random

			search_space:
			  batch_size:
					type: choice
					values: [25, 50, 100]
				first_layer_neurons:
			    type: choice
			    values: [10, 50, 200, 300, 500]
			  second_layer_neurons:
			    type: choice
			    values: [10, 50, 200, 500]
			  learning_rate:
				  type: loguniform
			    min_value: -6
			    max_value: -1

			objective:
			  primary_metric: validation_acc
			  goal: maximize

			early_termination:
		    policy_type: bandit
		    slack_factor: 0.1
		    evaluation_interval: 2
		    delay_evaluation: 5

			limits:
			  max_total_trials: 4
			  max_concurrent_trials: 4
```

And below is the component YAML. It need to take the sweepbale paramter as input. 


``` YAML
name: minist_train
version: 0.0.1
display_name: minist_train
type: CommandComponent
is_deterministic: true

inputs:
  data_folder:
    type: uri_folder
    optional: false
  batch_size:
    type: integer
    description: Batch size for each epoch
    optional: false
  first_layer_neurons:
    type: integer
    description: Number of neurons of neural networks's first layer
    optional: false
  second_layer_neurons:
    type: integer
    description: Number of neurons of neural networks's second layer
    optional: false
  learning_rate:
    type: float
    description: Learning rate
    min: 0.001
    max: 0.1
    optional: false
outputs:
  saved_model:
    type: mlmodel
    description: path of saved_model of trial run

environment: azureml:AzureML-sklearn-0.24-ubuntu18.04-py37-cuda11-gpu:3

code: 
	local_path: ./train_src

command: >-
  echo "Start training ..." &&
  python mnist.py --data_folder ${{inputs.data_folder}} --batch_size ${{inputs.batch_size}}
  --first_layer_neurons ${{inputs.first_layer_neurons}} --second_layer_neurons ${{inputs.second_layer_neurons}}
  --learning_rate ${{inputs.learning_rate}} [--resume-from ${{inputs.resume_from}}] --saved_model ${{outputs.saved_model}}
```


### Python SDK

In Azure Machine Learning Python SDK, sweep is a method of command component class. You can enable sweep for any command component by calling the .sweep() method of a command component instance. 

Below code snipe shows how to enable sweep for command component "minst_train". It assumes you already define the "minst_train" component that takes data_folder, batch_size, first_layer_neurons, second_layer_neurons, learning_rate as input. Now let's enable sweep for the later four parameters.  


```Python

from azureml import sweep
from azureml.train.sweep import choice, loguniform, policy

train_set = "./data/mnist/train-images.gz"

compute_name = "my_aml_compute"
datastore_name = "my_blob"

train_mnist_func = Component.load(ws, "minist_train")

@dsl.pipeline(
    name='Sweep_component_pipeline_for_hyperparameter_tuning',
    description='Train a mnist dataset with sweep component',
)
def mnist_training_pipeline() -> Pipeline:    
		train = train_mnist_func(
			data_folder=train_set,
			batch_size=choice([25, 50, 100]),
			first_layer_neurons=choice([10, 50, 200, 300, 500]),
			second_layer_neurons=choice([10, 50, 200, 500]),
			learning_rate=loguniform(-5, -1),
	   )

		train.sweep(			
			algorithm = 'random',
			early_termination = BanditPolicy(
        slack_factor=0.1, evaluation_interval=2, delay_evaluation=5
			),
	    limits(max_total_trials=4, max_concurrent_trials=4)
		)

    return train_mnist_component.outputs

pipeline = mnist_training_pipeline()
ml_client.jobs.create_or_update(pipeline, experiment_name="train_mnist_component") 
```

**[to-do] add code snnip of command component interface defination**


### UI
Assume you already have defined a command component. You can enable sweep easily in designer, the pipeline authoring GUI experience. 

Similarly to CLI and SDK, the prerequest to enable sweep in UI is to have a command component already defined. And the command component need to take sweepable parameter as input. 

If you build your command component using CLI or SDK. clone the pipeline in pipeline page. it will lead you to designer, the UI authoring page of pipeline. then right click the command component you want to sweep. 

1. clone the pipeline. it will link you to designer, the pipeline authoring GUI in where you can eanble sweep in UI.
![clone the pipeline run](./zhanxia-temp-media/clone-pipeline.png)
zhanxia-temp-media\clone-pipeline.png

2. enable sweep
![enable sweep](./zhanxia-temp-media/enable-sweep.png)

3. Add a parameter to search space.  and set sweep settings.
![sweep setting](./zhanxia-temp-media/sweep-right-panel.png)


**[to-do]call out the sections in right panel. search space. run setting.  and objective name, need to define in training script**

If you build your pipeline using designer directly. Select the component-
**[to-do] add screenshot of find component in designer**

then enable sweep for the command that do the training, set the sweep related settings in right panel. The last two step is the same as above. 