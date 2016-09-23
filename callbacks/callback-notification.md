# callbackNotify

## Description

There are a few instances in which a JavaScript alert will be displayed with the plugin. Examples of this include when 
geocoding fails, if the locations are farther from the user’s origin than the distance alert limit setting, etc. This 
callback can be used if you’d rather notify the user with something other than alerts.

## Parameters

| Name | Type | Description |
|---|---|---|
| notifyText | string | The notification string to be displayed |