function logN (num) {
	var e = 2.718281828
	return Math.log(num) / Math.log(e);
}


function Primes() {

// upper bound
//n log n + n log log n
	function approxSizeOfNthPrime (num) {
		return num * logN(num) + num * logN(logN(num));
	}

	function getPrimes(max) {
		var sieve = [], i, j, primes = [];
		for (i = 2; i <= max; ++i) {
			if (!sieve[i]) {
				// i has not been marked -- it is prime
				primes.push(i);
				for (j = i << 1; j <= max; j += i) {
					sieve[j] = true;
				}
			}
		}
		return primes;
	}

	this.getPrimeCount = function() {
		return this.primes.length;
	};

	this.getPrime = function(n) {
		return this.primes[n-1];
	};

	this.search = function(n) {
		var max = approxSizeOfNthPrime(n);
		this.primes = getPrimes(max);
		this.primes.length = n;
	}
}