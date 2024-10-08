// library.js

(function() {
    // Function to set a cookie
    function setCookie(name, value, days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Function to get a cookie
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Function to generate a session ID
    function generateSessionId() {
        return 'xxxx-xxxx-4xxx-yxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Function to ensure global_id is set
    function ensureGlobalId() {
        var globalId = getCookie('_dcc');
        if (!globalId) {
            globalId = generateSessionId();
            setCookie('_dcc', globalId, 365); // Set the global_id cookie with 1 year expiry
        }
        return globalId;
    }

    // Validate and sanitize input
    function sanitizeInput(input) {
        return input.replace(/[^\w\s.-]/gi, '');
    }

    // Function to send data
    function sendData(line_user_id) {
        // Collect data
        var globalId = ensureGlobalId();
        var pageUrl = window.location.href;
        var referrer = document.referrer;
        var title = document.title;
        var host = window.location.hostname;
        var cookie_id = getCookie('_td') ? sanitizeInput(getCookie('_td')) : null;

        var urlencoded = new URLSearchParams();
        urlencoded.append("title", title);
        urlencoded.append("page_url", pageUrl);
        urlencoded.append("referrer", referrer);
        urlencoded.append("host", host);
        urlencoded.append("line_user_id", line_user_id);
        urlencoded.append('dc_client_id', globalId);

        // Send data using fetch
        fetch('https://www.dcbloodhound.com/tracking/index.php?c=track&m=shell_activities_pv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlencoded.toString()
        })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(function(data) {
            console.log('Success:', data);
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
    }

    // Expose the functions
    window.trackerLib = {
        setCookie: setCookie,
        getCookie: getCookie,
        generateSessionId: generateSessionId,
        ensureGlobalId: ensureGlobalId,
        sanitizeInput: sanitizeInput,
        sendData: sendData
    };
})();
