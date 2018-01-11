# callbackFormVals

## Description

Fires after the form values have been processed from the form. If you are planning on sending these values to a database
make sure to sanitize the values first.

## Parameters

| Name | Type | Description |
|---|---|---|
| addressInput | string | User address input |
| searchInput | string | User name search input when using nameSearch setting |
| distance | string | User distance selection when using maxDistance setting |
| region | string | User region selection when using regionID setting or callbackRegion callback |
