const accessToken = "your_access_token";

fetch("http://example.com/protected", {
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
})
    .then(response => {
        if (response.status === 401) {
            // Access token has expired, attempt to refresh it
            return fetch("http://example.com/refresh-token", {
                headers: {
                    "Authorization": `Bearer ${refreshToken}`
                }
            })
                .then(response => {
                    if (response.ok) {
                        // Refresh token is valid, update access token and retry the original request
                        const { accessToken: newAccessToken } = response.json();
                        localStorage.setItem("accessToken", newAccessToken);
                        return fetch("http://example.com/protected", {
                            headers: {
                                "Authorization": `Bearer ${newAccessToken}`
                            }
                        });
                    } else {
                        // Refresh token is invalid, redirect to login page
                        window.location.href = "/login";
                    }
                });
        } else {
            // Access token is valid, process the response
            return response.json();
        }
    })
    .then(data => {
        // Do something with the response data
    })
    .catch(error => {
        console.error(error);
    });
