# Model Sweeping and Selection
During training time, we loop through a variety of models in order to choose from a set of models which could performe well each under different circumstances. This is referred as "model sweeping" in the rest of the text. And then the best model is selected from this pool based on primary metric evaluated on out-of-sample data, through user-provided validation data or cross-validations.

In particular, every time series model or model class (which we will explain later) trains once in deterministic order, and then the regression models except for Prophet and TCN each paired with different preprocessor and hyperparameters will be recommended by a proprietary backend serivce for training. The model sweeping continues until the number of iterations the user chose is reached, or the early-stopping criterion is satisfied (i.e. metric doesn’t improve much in recent iterations). As long as at least two models have been looped through before the last iteration, the last iteration will usually be the voting ensemble model. And then, at the end of the training run, AutoML will select the model which has the best metric calculated from the validation set user provided, or from cross-validations.

When TCN is enabled, the tcn models are trained on multiple HyperDrive (HD) runs where the hyper-parameters including network depth, learning rate and dropout are randomly selected from the parameter space in each run and then evaluated on validation data. At the end, the hyper-parameter combination which has the best metric is selected for the best model.To have confidence in the accuracy of the model selected, please allow at least 50-75 completed HD runs.

In order to select the best combination of hyper-parameters, TCN models are trained on multiple HyperDrive (HD) runs where the hyper-parameters are randomly selected from the parameter space in each run and then evaluated on validation data. At the end of training, the hyper-parameter combination with the best evaluation metric is selected. To have confidence in the accuracy of the model selected, please allow at least 50-75 completed HD runs.

## Model Sweeping
### Model Sweeping for Time Series Models And Prophet
Like mentioned above, each time series model and Prophet will train in deterministic order in each training run, before the training of any regression models.

Some timeseries models are rather a "model class" instead of a single model, like "ExponentialSmoothing" and "AutoArima" or "ArimaX", which refer to a group of models under the name. For example, the "ExponentialSmoothing" is really a family of models, differs by the modeling of seasonality/trend/error types (linearly or multiplicatively). So within the training iteration of those model class, we have an internal loop which conducts a grid search and selects the best model from that class. Usually the selection creterion is some form of penalized likelihood, e.g. AIC or AICc. We would direct the interested users to [the respective section in this book](https://otexts.com/fpp3/arima-estimation.html#information-criteria

### Model Sweeping for Regression Models
After the training of time series models, the regression models (except for Prophet and TCN), e.g. tree-based models like RandomForest and regression models like ElasticNet, will be recommended by an optimized model-selection algorithm. 
In particular, each regression model is paired with a preprocessor which prepares the data before passing it to the model, for example, do some scaling on the features, or use PCA to select the first several principal components. There are also hyperparameters associated with the models (e.g. number of trees and tree depth in RandomForest). The ML model, the preprocessor and the hyperparameters combines to be a ML pipeline, and the pipeline differs as long as any of the components differs. AutoML will decide which ML pipeline to be tried during the next iteration according to the recommendation of the algorithm.
We should also point out that we don’t support configuring the preprocessors currently.

## Model Selection
Like mentioned above, we use cross-validation or user-provided validation dataset to calculate the primary metric for model selection. While this is a commonly used approach in machine learning, there’s some caveats in forecasting tasks, as the train/validation splits have to honor the time order. Specifically, for each time series, the timestamps in the training data have to be earlier than any of the timestamps in the validation data, or the models built from this data split could suffer from information leaks.

For this reason, only **Rolling Origin Cross Validation (ROCV)** is used for cross-validations in AutoMl forecasting tasks. ROCV divides the series into training and validation data using an origin time point. Sliding the origin in time generates the cross-validation folds. This strategy preserves the time series data integrity and eliminates the risk of information leakage.

<figure>
  <img
  src="./images/time_series_cross_validation.png"
  alt="time_series_cross_validation">
  <figcaption>
  
  **Diagram showing cross validation folds separates the training and validation sets based on the cross validation step size.**
  
  </figcaption>
</figure>

In order to use cross-validations, you could specify the training data directly in the `AutoMLConfig` object. Learn more about the [AutoMLConfig](#configure-experiment). Set the number of cross validation folds with the parameter `n_cross_validations` and set the number of periods between two consecutive cross-validation folds with `cv_step_size`. You can also leave either or both parameters empty or set either/both to “auto”,  and AutoML will determine their values for you automatically. 
[!INCLUDE [sdk v1](../../includes/machine-learning-sdk-v1.md)]

```python
automl_config = AutoMLConfig(task='forecasting',
                             training_data= training_data,
                             n_cross_validations="auto", # Could be customized as an integer
                             cv_step_size = "auto", # Could be customized as an integer
                             ...
                             **time_series_settings)
```
You can also bring your own validation data, and specify it in `AutoMLConfig`. Learn more in [Configure data splits and cross-validation in AutoML](how-to-configure-cross-validation-data-splits.md#provide-validation-data).
