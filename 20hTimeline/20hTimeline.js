const currentDocument = document.currentScript.ownerDocument;

class Timeline extends HTMLElement {
	constructor() {
		super();
	}

	// Called when element is inserted in DOM
	connectedCallback() {
		// All of our components elements reside under shadow dom. So we created a this.shadowRoot property
		const shadowRoot = this.attachShadow({ mode: 'open' });

		// Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
		const template = currentDocument.querySelector('#users-timeline-template');
		const instance = template.content.cloneNode(true);
		// Current document needs to be defined to get DOM access to imported HTML
		shadowRoot.appendChild(instance);

		// Fetch the data of the last videos whatched from the API and call the render method with this data
		fetch('https://learn.20h.es/api/timeline')
			.then(response => {
				if (response.ok) return response.json();
				throw new Error('Request failed!');
			})
			.then(jsonResponse => {
				console.log(jsonResponse);
				this.render(jsonResponse);
			})
			.catch(error => console.error(error));
	}

	render(data) {
		data.forEach( element => {
			const timeReference = this.timeSince(element.created_at);
			const fixedSlug = this.fixeSlug(element.slug);
			// Fill the respective areas of the card using DOM manipulation APIs
			// We use this property to call selectors so that the DOM is searched only under this subtree
			this.shadowRoot.querySelector('.timeline__content').innerHTML += (
				`<div class="timeline__user-activity">
					<img class="timeline__user-avatar" src="${element.avatar}" alt="" />
					<div class="timeline__activity-info">
						<span class="timeline__bolder">${element.name}</span> watched <span class="timeline__bolder">${fixedSlug}</span>
					</div>
					<div class="timeline__date-info">${timeReference}</div>
				</div>`
			);
		});
	}

	timeSince(elDate) {
		let userDate = new Date(Date.parse(elDate));
		userDate.setHours(userDate.getHours() + 1);

		const now = new Date();
		const secondsPast = (now.getTime() - userDate.getTime()) / 1000;

    if(secondsPast < 60){
      return parseInt(secondsPast) + 'seconds ago';
    }
    if(secondsPast < 3600){
			if (parseInt(secondsPast/60) === 1 ) {
				return `${parseInt(secondsPast/60)} minute ago`;
			} else {
				return `${parseInt(secondsPast/60)} minutes ago`;
			}
    }
    if(secondsPast <= 86400){
			if (parseInt(secondsPast/3600) === 1) {
				return `${parseInt(secondsPast/3600)} hour ago`;
			} else {
				return `${parseInt(secondsPast/3600)} hours ago`;
			}
    }
    if(secondsPast > 86400){
        day = timeStamp.getDate();
        month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
        year = timeStamp.getFullYear() == now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
        return day + " " + month + year;
    }
	}

	fixeSlug(slug) {
	return slug.replace(/-/g, " ");
	}
}

// const frozenMyComponent = Object.freeze(UserCard);
customElements.define('users-timeline', Timeline);
