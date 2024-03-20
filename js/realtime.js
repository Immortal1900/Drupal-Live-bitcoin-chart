(function ($, Drupal, drupalSettings) {

    var obj = {}
    obj.timeframe = "5mins";
    obj.granularity = "5secs";


    async function ajaxcall2(ob = obj) {

        return new Promise(function (resolve, reject) {
            ajaxRequest = $.ajax({
                url: '/dtask/web/mongodb/getDataforLineChart',
                method: 'POST',
                dataType: 'json',
                data: ob,
                success: function (data) {

                    resolve(data); // Resolve the promise with the API response data
                },
                error: function (error) {
                    reject(error); // Reject the promise in case of an error
                },
            });
        });
    }

    async function ajaxcallcandle(timeframe = obj) {
        return new Promise(function (resolve, reject) {
            ajaxRequest = $.ajax({
                url: '/dtask/web/mongodb/getDataforCandleChart',
                method: 'POST',
                dataType: 'json',
                data: timeframe,
                success: function (data) {

                    resolve(data); // Resolve the promise with the API response data
                },
                error: function (error) {
                    reject(error); // Reject the promise in case of an error
                },
            });
        });
    }

    async function linechart(obj) {
        try {
            let chartData = await ajaxcall2(obj);
            var minValue = Math.min.apply(null, chartData.price);

            var maxValue = Math.max.apply(null, chartData.price);
            minValue = formatcurr(minValue)
            maxValue = formatcurr(maxValue)
            $('#time-frame-high').text("HIGH:" + maxValue);
            $('#time-frame-low').text("LOW:" + minValue);

            var trace =
            {
                x: chartData.time,
                y: chartData.price,
                type: 'scatter'
            };


            var data = [trace];
            var layout = {
                title: 'BTC/USD Line chart',
                xaxis: {
                    type: 'date',
                    rangeslider: { visible: false }
                },
            };

            Plotly.newPlot('candlestick-chart', data, layout, { scrollZoom: true });
        } catch (error) {
            console.log('Error:', error);
        }
    }
    function formatcurr(val) {
        curr = val.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        });
        return curr;
    }
    async function candlechart(timeframe) {
        try {
            let chartData = await ajaxcallcandle(timeframe);
            var minValue = Math.min.apply(null, chartData.close);
            var maxValue = Math.max.apply(null, chartData.close);
            minValue = formatcurr(minValue)
            maxValue = formatcurr(maxValue)

            $('#time-frame-high').text("HIGH:" + maxValue);
            $('#time-frame-low').text("LOW:" + minValue);


            var trace = {
                x: chartData.timestamp,
                open: chartData.open,
                close: chartData.close,
                high: chartData.high,
                low: chartData.low,
                type: 'candlestick',
                name: 'Candlesticks'
            };

            var data = [trace];

            var layout = {
                title: 'BTC/USD Candle chart',
                xaxis: {
                    rangeslider: {
                        visible: false // Set to false to hide the range slider
                    }
                },
                yaxis: {
                    title: 'Price'
                }
            };



            Plotly.newPlot('candlestick-chart', data, layout, { scrollZoom: true });
        } catch (error) {
            console.log('Error:', error);
        }
    }

    function start() {
        var selectedValue = $('#edit-graph-type').val();
        var timeframe = $('#edit-time-frame').val();
        var granularity = $('#edit-granularity').val();

        if (timeframe !== null || timeframe !== undefined || timeframe !== '') {
            obj.timeframe = timeframe;
        }
        if (granularity !== null || granularity !== undefined || granularity !== '') {
            obj.granularity = granularity;
        }
        if (selectedValue === 'candle') {
            candlechart(obj);
        } else if (selectedValue === 'line') {
            linechart(obj);
        }
    }

    $(document).ready(function () {
        start();

    });

    $('#edit-graph-type').on('change', function () {

        var selectedValue = $("#edit-graph-type").val()
        var timeframe = $("#edit-time-frame").val()
        var graphtype = $("#edit-graph-type").val()
        ob = {}
        if (timeframe) {
            ob.timeframe = timeframe;
        }
        else {

            ob.timeframe = "5mins";
        }

        // Perform an action with the selected value.
        if (selectedValue === 'candle') {

            candlechart();

        } else if (selectedValue === 'line') {

            linechart();
        }
    });

    $('#edit-time-frame').on('change', function () {

        var timeframe = $("#edit-time-frame").val()
        var graphtype = $("#edit-graph-type").val()
        var granularity = $('#edit-granularity').val();
        if (timeframe !== null || timeframe !== undefined || timeframe !== '') {
            obj.timeframe = timeframe;
        }
        if (granularity !== null || granularity !== undefined || granularity !== '') {
            obj.granularity = granularity;
        }



        if (graphtype === 'line') {

            linechart(obj);

        } else if (graphtype === 'candle') {

            candlechart(obj);
        }
    });

    $('#edit-granularity').on('change', function () {
  
        var timeframe = $('#edit-time-frame').val();
        var graphtype = $("#edit-graph-type").val()
        var granularity = $('#edit-granularity').val();
        ob = {}

        if (timeframe !== null || timeframe !== undefined || timeframe !== '') {
            obj.timeframe = timeframe;
        }
        if (granularity !== null || granularity !== undefined || granularity !== '') {
            obj.granularity = granularity;
        }

        if (graphtype === 'candle') {

            candlechart();

        } else if (graphtype === 'line') {
     
            linechart();
        }
    });




    setInterval(start, 2000);
    // Make the API call every 2 seconds
})(jQuery, Drupal, drupalSettings);
