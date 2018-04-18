---
title: Azure Custom Decision Service Experimentation reference | Microsoft Docs
description: A guide for Azure Custom Decision Service experimentation.
services: cognitive-services
author: marco-rossi29
manager: marco-rossi29

ms.service: cognitive-services
ms.topic: article
ms.date: 01/18/2018
ms.author: marossi
---

# Custom Decision Service Experimentation reference

Following the theory of contextual bandits (cb), Custom Decision Service repeatedly observes a context, takes an action, and observes a reward for the chosen action. An example is content personalization: the context describes a user, actions are candidate stories, and the reward measures how much the user liked the recommended story.

Custom Decision Service produces a policy, meaning a mapping from contexts to actions. Given a target policy, one would like to know its expected reward. One way to estimate this reward is by deploying a policy online and letting it choose actions (e.g., recommend stories to users). Such online evaluation is typically costly, since it exposes users to an untested experimental policy, and does not scale to evaluating many target policies.

Off-policy evaluation is an alternative paradigm for the same question. Given logs from an existing online system, which follow a given logging policy, off-policy evaluation estimates the expected reward of new target policies.

Given the log file, Experimentation seeks to find the policy with the highest estimated expected reward. Target policies are parameterized by [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit/wiki) arguments. In the default mode, the script tests different Vowpal Wabbit arguments (appending to the `--base_command`) by serially performing the following steps:
1. Auto-detect features namespaces from the first `--auto_lines` lines of the input file
2. First sweep over hyper-parameters (`learning rate`, `L1 regularization`, and `power_t`)
3. Test policy evaluation `--cb_type` (inverse propensity score (`ips`) or doubly robust (`dr`) - see [here](https://github.com/JohnLangford/vowpal_wabbit/wiki/Contextual-Bandit-Example))
4. Test marginals
5. Test quadratic interaction features
   * brute-force phase: testing all combinations with `--q_bruteforce_terms` pairs or fewer
   * greedy phase: adding the best pair until no improvement for `--q_greedy_stop` rounds
6. Second sweep over hyper-parameters (`learning rate`, `L1 regularization`, and `power_t`)

The parameters to control the preceding steps include the following Vowpal Wabbit arguments:
- Example Manipulation options
  - shared namespaces
  - action namespaces
  - marginal namespaces
  - quadratic features
- Update Rule options
  - learning rate
  - L1 regularization
  - t power value

An in-depth explanation of Vowpal Wabbit arguments can be found [here](https://github.com/JohnLangford/vowpal_wabbit/wiki/Command-line-arguments).

## Prerequisites
- Vowpal Wabbit (installed and on your path)
  - Windows: Use `.msi` installer [here](https://github.com/eisber/vowpal_wabbit/releases)
  - Other platforms: Source code [here](https://github.com/JohnLangford/vowpal_wabbit/releases)
- Python 3 (installed and on your path)
- numpy (use the package manager of your choice)
- `Microsoft/mwt-ds` repository (clone from [here](https://github.com/Microsoft/mwt-ds))
- Decision Service JSON log file: By default, the base command includes `--dsjson`, which enables Decision Service JSON parsing of the input data file. An example of this format can be found [here](https://github.com/JohnLangford/vowpal_wabbit/blob/master/test/train-sets/decisionservice.json)

## Usage
Navigate into `mwt-ds/DataScience` and run `Experimentation.py` with the relevant arguments, as detailed in the following.

```cmd
python Experimentation.py [-h] -f FILE_PATH [-b BASE_COMMAND] [-p N_PROC]
                          [-s SHARED_NAMESPACES] [-a ACTION_NAMESPACES]
                          [-m MARGINAL_NAMESPACES] [--auto_lines AUTO_LINES]
                          [--only_hp] [-l LR_MIN_MAX_STEPS]
                          [-r REG_MIN_MAX_STEPS] [-t PT_MIN_MAX_STEPS]
                          [--q_bruteforce_terms Q_BRUTEFORCE_TERMS]
                          [--q_greedy_stop Q_GREEDY_STOP]
```

A log of the results is appended to the file `mwt-ds/DataScience/experiments.csv`

### Parameters
| Input | Description | Default |
| --- | --- | --- |
| `-h`, `--help` | show help message and exit | |
| `-f FILE_PATH`, `--file_path FILE_PATH` | data file path (`.json` or `.json.gz` format - each line is a `dsjson`) | Required |  
| `-b BASE_COMMAND`, `--base_command BASE_COMMAND` | base Vowpal Wabbit command  | `vw --cb_adf --dsjson -c` |  
| `-p N_PROC`, `--n_proc N_PROC` | number of parallel processes to use | logical processors |  
| `-s SHARED_NAMESPACES, --shared_namespaces SHARED_NAMESPACES` | shared feature namespaces; e.g., `abc` means namespaces `a`, `b`, and `c`  | auto-detect from data file |  
| `-a ACTION_NAMESPACES, --action_namespaces ACTION_NAMESPACES` | action feature namespaces | auto-detect from data file |  
| `-m MARGINAL_NAMESPACES, --marginal_namespaces MARGINAL_NAMESPACES` | marginal feature namespaces | auto-detect from data file |  
| `--auto_lines AUTO_LINES` | number of data file lines to scan to auto-detect features namespaces | `100` |  
| `--only_hp` | sweep only over hyper-parameters (`learning rate`, `L1 regularization`, and `power_t`) | `False` |  
| `-l LR_MIN_MAX_STEPS`, `--lr_min_max_steps LR_MIN_MAX_STEPS` | learning rate range as positive values `min,max,steps` | `1e-5,0.5,4` |  
| `-r REG_MIN_MAX_STEPS`, `--reg_min_max_steps REG_MIN_MAX_STEPS` | L1 regularization range as positive values `min,max,steps` | `1e-9,0.1,5` |  
| `-t PT_MIN_MAX_STEPS`, `--pt_min_max_steps PT_MIN_MAX_STEPS` | power_t range as positive values `min,max,step` | `1e-9,0.5,5` |  
| `--q_bruteforce_terms Q_BRUTEFORCE_TERMS` | number of quadratic pairs to test in brute-force phase | `2` |  
| `--q_greedy_stop Q_GREEDY_STOP` | rounds without improvements after which quadratic greedy search phase is halted | `3` |  

### Examples
To use the preset default values:
```cmd
python Experimentation.py -f D:\multiworld\data.json
```

Equivalently, Vowpal Wabbit can also ingest `.json.gz` files:
```cmd
python Experimentation.py -f D:\multiworld\data.json.gz
```

To only sweep over hyper-parameters (`learning rate`, `L1 regularization`, and `power_t` - stopping after step 2):
```cmd
python Experimentation.py -f D:\multiworld\data.json --only_hp
```
