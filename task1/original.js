function PrimesOrg() {
	this.primesCount = 0;
	this.primes = null;

	this.getPrimeCount = function () {
		return this.primesCount;
	};

	this.getPrime = function (i) {
		return this.primes[i];
	};

	this.addPrime = function (i) {
		this.primes[this.primesCount++] = i;
	};

	this.isDivisible = function (i, by) {
		return (i % by) == 0;
	};

	this.isPrimeDivisible = function (candidate) {
		for (var i = 1; i <= this.primesCount; ++i) {
			if (this.isDivisible(candidate, this.getPrime(i))) {
				return true;
			}
		}

		return false;
	};

	this.search = function (max) {
		var c = 1;

		this.primesCount = 0;
		this.primes = [];

		while (this.getPrimeCount() < max) {
			if (!this.isPrimeDivisible(c)) {
				this.addPrime(c);
			}
			c++;
		}
	}
}