(function() {
    var fuzzyVar = require('../Variaveis/Fuzzy.js');
    var MFin1=fuzzyVar.MFin1,
        MFin2=fuzzyVar.MFin2,
        R=fuzzyVar.R,
        MFout=fuzzyVar.MFout;
    function Fuzzy()
    {
        this.controller = function(e1, e2 )
        {
            B1 = this.calculateBelonging(MFin1, e1);
            B2 = this.calculateBelonging(MFin2, e2);
            Bout = this.applyRules(R, B1, B2, MFout);
            return this.defuzzify(Bout, MFout);
        }
        //Unit testing done
        this.applyRules = function(R, B1, B2, MFOut)
        {
            var Bout = [];
            var z;
            var ind;
            for(i in MFOut)
                Bout.push(0);
            for(var i in B1)
                {
                    for(var j in B2)
                        {
                            z = Math.min(B1[i], B2[j]);
                            ind = R[i][j];
                            if(z > Bout[ind-1])
                                Bout[ind-1] = z;
                        }
                }
                return Bout;
        }
        //Unit testing done
        this.caac = function(MF, B)
        {
            var a = 0;
            var b = 0;
            var c = 0;
            var d = 0;
            var ll = 0;
            var el = 0;
            var er = 0;
            var lr = 0;
            if(B == 0)
                {
                    A = 0;
                    cent = 0;
                }
                else if(B < 1)
                    {
                        b = MF[2] - MF[0];
                        a = b*(1-B);
                        el = MF[1] - MF[0];
                        ll = B*el;
                        c = Math.sqrt(ll*ll + B*B);
                        er = MF[2] - MF[1];
                        lr = B*er;
                        d = Math.sqrt(lr*lr + B*B);
                        cent = MF[0] + b/2 + (2*a+b)*(c*c - d*d)/(6*(b*b - a*a));
                        A = B*(a+b)/2;
                    }
                    else
                        {
                            A = 1/2*1*(MF[2]-MF[0]);
                            cent = 1/3*(MF[2] + MF[0] + MF[1]);
                        }
                        return [A, cent]
        }
        //Unit testing done
        this.calculateBelonging = function(MFin, u)
        {
            B = [];
            for(i in MFin)
                {
                    if(u > MFin[i][0] && u < MFin[i][2])
                        {
                            if(u < MFin[i][1])
                                b = (u - MFin[i][0]) / (MFin[i][1] - MFin[i][0]);
                            else
                                b = (MFin[i][2] - u) / (MFin[i][2] - MFin[i][1]);
                        }
                        else b = 0;
                        B.push(b);
                }
                return B;
        }
        //Unit testing done
        this.overlap = function(L, R, h1, h2)
        {
            var h = Math.min(h1, h2);
            var a = 0; var b = 0; var c = 0;
            var d = 0; var ll = 0; var el = 0;
            var er = 0; var lr = 0;
            if(h == 0)
                {
                    olsize = 0;
                    olcent = 0;
                }
                else if(L[2] > R[0])
                    {
                        kl = -1/(L[2]-L[1]);
                        kr = 1/(R[1]-R[0]);
                        xcross = 1/(kl-kr)*(kl*L[1]-kr*R[1]);
                        ycross = kl*(xcross-L[1])+1;
                        if(ycross >= h)
                            {
                                b = L[2]-R[0];
                                a = b*(ycross-h)/ycross;
                                el = xcross-R[0];
                                ll = h*el/ycross;
                                c = Math.sqrt(ll*ll+h*h);
                                er = L[2] - xcross;
                                lr = h*er/ycross;
                                d = Math.sqrt(lr*lr+h*h);
                                olcent = R[0] + b/2 + (2*a+b)*(c*c-d*d)/(6*(b*b-a*a));
                                olsize = h*(a+b)/2;
                            }
                            else
                                {
                                    olsize = 1/2*ycross*(L[2]-R[0]);
                                    olcent = 1/3*(L[2]+R[0]+xcross);
                                }
                    }
                    else
                        {
                            olsize = 0;
                            olcent = 0;
                        }
                        return [olsize, olcent];
        }
        //Unit testing done
        this.defuzzify = function(Bout, MFout)
        {
            var A = [];
            var c = [];
            var Ao = [];
            var co = [];
            for(i = 0; i < MFout.length; i++)
            {
                temp = this.caac(MFout[i], Bout[i]);
                if(isNaN(temp[0]))
                    temp[0] = 0;
                if(isNaN(temp[1]))
                    temp[1] = 0;
                A.push(temp[0]);
                c.push(temp[1]);
                if(i < MFout.length-1)
                    {
                        temp = this.overlap(MFout[i], MFout[i+1], Bout[i], Bout[i+1]);
                        if(isNaN(temp[0]))
                            temp[0] = 0;
                        if(isNaN(temp[1]))
                            temp[1] = 0;
                        Ao.push(temp[0]);
                        co.push(temp[1]);
                    }
            }
            this.numerator = sum(ew_pro(c, A)) - sum(ew_pro(co, Ao));
            this.denominator = sum(A) - sum(Ao);
            F = this.numerator/this.denominator;
            if(F*F > 1000 || isNaN(F)){ F = 0; }
            return F;
        }
    }
    /* Additional functions for help */
    sum = function(arr)
    {
        this.s = 0;
        for(i in arr)
            this.s += arr[i];
        return this.s;
    }
    ew_pro = function(A, B)
    {
        var P = [];
        for(i in A)
            P.push(A[i]*B[i]);
        return P;
    }
    module.exports = new Fuzzy();
}());
