export const generatePaginationNumbers = (
	currentPage: number,
	totalPages: number
) => {
	//Si el numero total de páginas es 5 0 menos
	if (totalPages <= 5) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	//Si la página actual está entre las primera 3 páginas
	if (totalPages <= 3) {
		return [1, 2, 3, '...', totalPages - 1, totalPages];
	}

	//Si la página actual está entre las últimas 3 páginas
	if (currentPage >= totalPages - 2) {
		return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
	}

	//Si la página actual está en un lugar medio
	return [
		1,
		'...',
		currentPage - 1,
		currentPage,
		currentPage + 1,
		'...',
		totalPages,
	];
};
