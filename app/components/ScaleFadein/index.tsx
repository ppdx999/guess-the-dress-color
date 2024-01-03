import {styled} from 'styled-components';

export const ScaleFadein = styled.div`
	@keyframes scalefadein {
		0% {
			opacity: 0;
			scale: 0;
		}
		80% {
			opacity: 1;
			scale: 3;
		}
		100% {
			opacity: 1;
			scale: 1;
		}
	}
	animation: scalefadein 3s ease-in-out;
`;
